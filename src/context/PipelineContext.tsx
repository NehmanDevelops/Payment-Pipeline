'use client';

import { createContext, useContext, useReducer, useCallback, useEffect, ReactNode } from 'react';
import { Transaction, TransactionStatus, PipelineMetrics, StageLog } from '@/types';
import { 
  generateTransaction, 
  getNextStage, 
  shouldFailTransaction, 
  getStageLatency,
  getFailureMessage 
} from '@/lib/transaction-generator';

interface PipelineState {
  transactions: Transaction[];
  retryQueue: Transaction[];
  metrics: PipelineMetrics;
  isRunning: boolean;
  speed: number; // 1 = normal, 2 = fast, 0.5 = slow
}

type PipelineAction =
  | { type: 'ADD_TRANSACTION'; payload: Transaction }
  | { type: 'UPDATE_TRANSACTION'; payload: { id: string; updates: Partial<Transaction> } }
  | { type: 'MOVE_TO_RETRY'; payload: string }
  | { type: 'RETRY_TRANSACTION'; payload: string }
  | { type: 'UPDATE_METRICS' }
  | { type: 'SET_RUNNING'; payload: boolean }
  | { type: 'SET_SPEED'; payload: number }
  | { type: 'CLEAR_COMPLETED' };

const initialMetrics: PipelineMetrics = {
  totalTransactions: 0,
  successfulTransactions: 0,
  failedTransactions: 0,
  avgProcessingTime: 0,
  throughput: 0,
  stages: [
    { id: 'initiated', name: 'Initiated', description: 'Transaction received', icon: 'play', avgLatency: 100, successRate: 100, activeTransactions: 0 },
    { id: 'fraud_check', name: 'Fraud Check', description: 'ML-based risk scoring', icon: 'shield', avgLatency: 500, successRate: 92, activeTransactions: 0 },
    { id: 'balance_verify', name: 'Balance Verify', description: 'Account validation', icon: 'wallet', avgLatency: 250, successRate: 95, activeTransactions: 0 },
    { id: 'processing', name: 'Processing', description: 'Transaction execution', icon: 'cog', avgLatency: 650, successRate: 98, activeTransactions: 0 },
    { id: 'settlement', name: 'Settlement', description: 'Final settlement', icon: 'check', avgLatency: 1250, successRate: 99, activeTransactions: 0 },
  ],
};

const initialState: PipelineState = {
  transactions: [],
  retryQueue: [],
  metrics: initialMetrics,
  isRunning: true,
  speed: 1,
};

function pipelineReducer(state: PipelineState, action: PipelineAction): PipelineState {
  switch (action.type) {
    case 'ADD_TRANSACTION':
      return {
        ...state,
        transactions: [action.payload, ...state.transactions].slice(0, 100), // Keep last 100
      };

    case 'UPDATE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.map((t) =>
          t.id === action.payload.id ? { ...t, ...action.payload.updates } : t
        ),
      };

    case 'MOVE_TO_RETRY':
      const txToRetry = state.transactions.find((t) => t.id === action.payload);
      if (!txToRetry) return state;
      return {
        ...state,
        retryQueue: [...state.retryQueue, { ...txToRetry, status: 'retry_queue' as TransactionStatus }],
      };

    case 'RETRY_TRANSACTION':
      return {
        ...state,
        retryQueue: state.retryQueue.filter((t) => t.id !== action.payload),
      };

    case 'UPDATE_METRICS':
      const completed = state.transactions.filter((t) => t.status === 'completed');
      const failed = state.transactions.filter((t) => t.status === 'failed');
      const total = completed.length + failed.length;
      
      const avgTime = completed.length > 0
        ? completed.reduce((acc, t) => {
            const totalLatency = t.stages.reduce((sum, s) => sum + (s.latency || 0), 0);
            return acc + totalLatency;
          }, 0) / completed.length
        : 0;

      const stageCounts = state.transactions.reduce((acc, t) => {
        if (t.status !== 'completed' && t.status !== 'failed' && t.status !== 'retry_queue') {
          acc[t.status] = (acc[t.status] || 0) + 1;
        }
        return acc;
      }, {} as Record<string, number>);

      return {
        ...state,
        metrics: {
          ...state.metrics,
          totalTransactions: state.transactions.length,
          successfulTransactions: completed.length,
          failedTransactions: failed.length,
          avgProcessingTime: Math.round(avgTime),
          throughput: total > 0 ? Math.round((completed.length / total) * 100) : 0,
          stages: state.metrics.stages.map((s) => ({
            ...s,
            activeTransactions: stageCounts[s.id] || 0,
          })),
        },
      };

    case 'SET_RUNNING':
      return { ...state, isRunning: action.payload };

    case 'SET_SPEED':
      return { ...state, speed: action.payload };

    case 'CLEAR_COMPLETED':
      return {
        ...state,
        transactions: state.transactions.filter(
          (t) => t.status !== 'completed' && t.status !== 'failed'
        ),
      };

    default:
      return state;
  }
}

interface PipelineContextType {
  state: PipelineState;
  addTransaction: () => void;
  toggleRunning: () => void;
  setSpeed: (speed: number) => void;
  clearCompleted: () => void;
  retryTransaction: (id: string) => void;
}

const PipelineContext = createContext<PipelineContextType | null>(null);

export function PipelineProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(pipelineReducer, initialState);

  const processTransaction = useCallback(async (transaction: Transaction) => {
    let currentTx = transaction;
    
    while (currentTx.status !== 'completed' && currentTx.status !== 'failed') {
      const nextStage = getNextStage(currentTx.status);
      if (!nextStage) break;

      const latency = getStageLatency(nextStage);
      await new Promise((resolve) => setTimeout(resolve, latency / state.speed));

      const shouldFail = shouldFailTransaction(currentTx, nextStage);
      
      const stageLog: StageLog = {
        stage: nextStage,
        enteredAt: new Date(),
        exitedAt: new Date(),
        latency,
        success: !shouldFail,
        message: shouldFail ? getFailureMessage(nextStage, currentTx) : `${nextStage} completed`,
      };

      if (shouldFail) {
        dispatch({
          type: 'UPDATE_TRANSACTION',
          payload: {
            id: currentTx.id,
            updates: {
              status: 'failed',
              stages: [...currentTx.stages, stageLog],
            },
          },
        });
        dispatch({ type: 'MOVE_TO_RETRY', payload: currentTx.id });
        break;
      }

      currentTx = {
        ...currentTx,
        status: nextStage === 'settlement' ? 'completed' : nextStage,
        stages: [...currentTx.stages, stageLog],
      };

      dispatch({
        type: 'UPDATE_TRANSACTION',
        payload: {
          id: currentTx.id,
          updates: {
            status: currentTx.status,
            stages: currentTx.stages,
          },
        },
      });
    }

    dispatch({ type: 'UPDATE_METRICS' });
  }, [state.speed]);

  const addTransaction = useCallback(() => {
    const tx = generateTransaction();
    dispatch({ type: 'ADD_TRANSACTION', payload: tx });
    processTransaction(tx);
  }, [processTransaction]);

  const toggleRunning = useCallback(() => {
    dispatch({ type: 'SET_RUNNING', payload: !state.isRunning });
  }, [state.isRunning]);

  const setSpeed = useCallback((speed: number) => {
    dispatch({ type: 'SET_SPEED', payload: speed });
  }, []);

  const clearCompleted = useCallback(() => {
    dispatch({ type: 'CLEAR_COMPLETED' });
  }, []);

  const retryTransaction = useCallback((id: string) => {
    const tx = state.retryQueue.find((t) => t.id === id);
    if (tx) {
      dispatch({ type: 'RETRY_TRANSACTION', payload: id });
      const newTx = { ...tx, status: 'initiated' as TransactionStatus, stages: [] };
      dispatch({ type: 'ADD_TRANSACTION', payload: newTx });
      processTransaction(newTx);
    }
  }, [state.retryQueue, processTransaction]);

  // Auto-generate transactions
  useEffect(() => {
    if (!state.isRunning) return;

    const interval = setInterval(() => {
      addTransaction();
    }, 2000 / state.speed);

    return () => clearInterval(interval);
  }, [state.isRunning, state.speed, addTransaction]);

  return (
    <PipelineContext.Provider
      value={{
        state,
        addTransaction,
        toggleRunning,
        setSpeed,
        clearCompleted,
        retryTransaction,
      }}
    >
      {children}
    </PipelineContext.Provider>
  );
}

export function usePipeline() {
  const context = useContext(PipelineContext);
  if (!context) {
    throw new Error('usePipeline must be used within a PipelineProvider');
  }
  return context;
}
