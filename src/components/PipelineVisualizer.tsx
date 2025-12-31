'use client';

import { motion } from 'framer-motion';
import { 
  Play, 
  Shield, 
  Wallet, 
  Cog, 
  CheckCircle, 
  ArrowRight,
  Zap
} from 'lucide-react';
import { usePipeline } from '@/context/PipelineContext';
import { TransactionStatus } from '@/types';

const stageConfig: Record<string, { icon: React.ReactNode; color: string; bgColor: string }> = {
  initiated: { 
    icon: <Play className="w-6 h-6" />, 
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/20 border-blue-500/50'
  },
  fraud_check: { 
    icon: <Shield className="w-6 h-6" />, 
    color: 'text-orange-400',
    bgColor: 'bg-orange-500/20 border-orange-500/50'
  },
  balance_verify: { 
    icon: <Wallet className="w-6 h-6" />, 
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/20 border-purple-500/50'
  },
  processing: { 
    icon: <Cog className="w-6 h-6" />, 
    color: 'text-cyan-400',
    bgColor: 'bg-cyan-500/20 border-cyan-500/50'
  },
  settlement: { 
    icon: <CheckCircle className="w-6 h-6" />, 
    color: 'text-green-400',
    bgColor: 'bg-green-500/20 border-green-500/50'
  },
};

const stages: { id: TransactionStatus; name: string; description: string }[] = [
  { id: 'initiated', name: 'Initiated', description: 'Transaction received' },
  { id: 'fraud_check', name: 'Fraud Check', description: 'ML risk scoring' },
  { id: 'balance_verify', name: 'Balance', description: 'Account validation' },
  { id: 'processing', name: 'Processing', description: 'Execution' },
  { id: 'settlement', name: 'Settlement', description: 'Final clearing' },
];

export function PipelineVisualizer() {
  const { state } = usePipeline();
  
  const getTransactionsAtStage = (stageId: TransactionStatus) => {
    return state.transactions.filter(
      (t) => t.status === stageId && t.status !== 'completed' && t.status !== 'failed'
    );
  };

  return (
    <div className="bg-gray-900/50 rounded-2xl border border-gray-800 p-6">
      <div className="flex items-center gap-2 mb-6">
        <Zap className="w-5 h-5 text-yellow-400" />
        <h2 className="text-xl font-bold text-white">Payment Pipeline</h2>
      </div>
      
      <div className="flex items-center justify-between gap-2 overflow-x-auto pb-4">
        {stages.map((stage, index) => {
          const config = stageConfig[stage.id];
          const txCount = getTransactionsAtStage(stage.id).length;
          const stageMetric = state.metrics.stages.find((s) => s.id === stage.id);
          
          return (
            <div key={stage.id} className="flex items-center">
              <motion.div
                className={`relative flex flex-col items-center p-4 rounded-xl border ${config.bgColor} min-w-[140px]`}
                animate={{
                  scale: txCount > 0 ? [1, 1.02, 1] : 1,
                  boxShadow: txCount > 0 
                    ? ['0 0 0 rgba(255,255,255,0)', '0 0 20px rgba(255,255,255,0.1)', '0 0 0 rgba(255,255,255,0)']
                    : '0 0 0 rgba(255,255,255,0)',
                }}
                transition={{ duration: 1, repeat: txCount > 0 ? Infinity : 0 }}
              >
                {/* Active transaction indicator */}
                {txCount > 0 && (
                  <motion.div
                    className="absolute -top-2 -right-2 bg-yellow-500 text-black text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                  >
                    {txCount}
                  </motion.div>
                )}
                
                <div className={`${config.color} mb-2`}>
                  {config.icon}
                </div>
                
                <span className="text-white font-semibold text-sm">{stage.name}</span>
                <span className="text-gray-400 text-xs">{stage.description}</span>
                
                {stageMetric && (
                  <div className="mt-2 text-xs text-gray-500">
                    ~{stageMetric.avgLatency}ms
                  </div>
                )}
              </motion.div>
              
              {index < stages.length - 1 && (
                <motion.div 
                  className="mx-2 text-gray-600"
                  animate={{
                    x: [0, 5, 0],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ArrowRight className="w-6 h-6" />
                </motion.div>
              )}
            </div>
          );
        })}
      </div>
      
      {/* Flowing transactions visualization */}
      <div className="mt-6 h-16 relative overflow-hidden rounded-lg bg-gray-800/50">
        <div className="absolute inset-0 flex items-center">
          {state.transactions
            .filter((t) => t.status !== 'completed' && t.status !== 'failed')
            .slice(0, 10)
            .map((tx, i) => {
              const stageIndex = stages.findIndex((s) => s.id === tx.status);
              const progress = (stageIndex / (stages.length - 1)) * 100;
              
              return (
                <motion.div
                  key={tx.id}
                  className="absolute w-3 h-3 rounded-full bg-yellow-400 shadow-lg shadow-yellow-400/50"
                  initial={{ left: '0%', opacity: 0 }}
                  animate={{ 
                    left: `${progress}%`, 
                    opacity: 1,
                  }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  style={{ top: `${20 + (i * 8) % 40}px` }}
                />
              );
            })}
        </div>
        
        {/* Stage markers */}
        {stages.map((_, index) => (
          <div
            key={index}
            className="absolute top-0 bottom-0 w-px bg-gray-700"
            style={{ left: `${(index / (stages.length - 1)) * 100}%` }}
          />
        ))}
      </div>
    </div>
  );
}
