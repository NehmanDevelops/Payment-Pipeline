'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Terminal, X, ChevronDown, ChevronUp, 
  Activity, Clock, CheckCircle, AlertTriangle 
} from 'lucide-react';
import { usePipeline } from '@/context/PipelineContext';

interface LogEntry {
  id: string;
  timestamp: Date;
  level: 'info' | 'warn' | 'error' | 'success';
  message: string;
  stage?: string;
}

export function SystemLogs() {
  const { state } = usePipeline();
  const [isExpanded, setIsExpanded] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const logsEndRef = useRef<HTMLDivElement>(null);

  // Generate logs based on transactions
  useEffect(() => {
    if (state.transactions.length > 0) {
      const latestTx = state.transactions[0];
      const newLog: LogEntry = {
        id: `${latestTx.id}-${latestTx.status}`,
        timestamp: new Date(),
        level: latestTx.status === 'completed' ? 'success' :
               latestTx.status === 'failed' ? 'error' :
               latestTx.fraudScore > 70 ? 'warn' : 'info',
        message: getLogMessage(latestTx.status, latestTx.id.slice(0, 8), latestTx.fraudScore),
        stage: latestTx.status,
      };

      setLogs(prev => {
        const exists = prev.some(l => l.id === newLog.id);
        if (exists) return prev;
        return [newLog, ...prev].slice(0, 50);
      });
    }
  }, [state.transactions]);

  const getLogMessage = (status: string, txId: string, fraudScore: number) => {
    switch (status) {
      case 'initiated':
        return `[INIT] Transaction ${txId} entered pipeline`;
      case 'fraud_check':
        return fraudScore > 70 
          ? `[FRAUD] HIGH RISK: ${txId} flagged (score: ${fraudScore})`
          : `[FRAUD] Transaction ${txId} passed fraud check (score: ${fraudScore})`;
      case 'balance_verify':
        return `[VERIFY] Balance verification for ${txId}`;
      case 'processing':
        return `[PROCESS] Transaction ${txId} processing...`;
      case 'settlement':
        return `[SETTLE] Transaction ${txId} entering settlement`;
      case 'completed':
        return `[DONE] Transaction ${txId} completed successfully ✓`;
      case 'failed':
        return `[FAIL] Transaction ${txId} failed - added to retry queue`;
      default:
        return `[LOG] Transaction ${txId} status: ${status}`;
    }
  };

  const getLevelStyles = (level: LogEntry['level']) => {
    switch (level) {
      case 'success': return 'text-green-400';
      case 'error': return 'text-red-400';
      case 'warn': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
  };

  useEffect(() => {
    if (isExpanded) {
      logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, isExpanded]);

  return (
    <div className="bg-gray-900/50 rounded-xl border border-gray-800 overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-gray-800/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-green-400" />
          <span className="text-sm font-medium text-gray-300">System Logs</span>
          {logs.length > 0 && (
            <span className="text-xs bg-gray-800 text-gray-400 px-2 py-0.5 rounded-full">
              {logs.length} entries
            </span>
          )}
        </div>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4 text-gray-400" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-400" />
        )}
      </button>

      {/* Log content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-gray-950 p-4 font-mono text-xs max-h-64 overflow-y-auto">
              {logs.length === 0 ? (
                <div className="text-gray-500 text-center py-4">
                  No logs yet. Start the pipeline to see activity.
                </div>
              ) : (
                logs.map((log, index) => (
                  <motion.div
                    key={log.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`py-1 ${getLevelStyles(log.level)}`}
                  >
                    <span className="text-gray-600">[{formatTime(log.timestamp)}]</span>{' '}
                    {log.message}
                  </motion.div>
                ))
              )}
              <div ref={logsEndRef} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
