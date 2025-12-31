'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { 
  RefreshCw, 
  Clock, 
  AlertTriangle,
  Play,
  DollarSign
} from 'lucide-react';
import { usePipeline } from '@/context/PipelineContext';

export function RetryQueue() {
  const { state, retryTransaction } = usePipeline();

  if (state.retryQueue.length === 0) {
    return null;
  }

  return (
    <div className="bg-gray-900/50 rounded-2xl border border-amber-500/30 p-6">
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle className="w-5 h-5 text-amber-400" />
        <h2 className="text-xl font-bold text-white">Retry Queue</h2>
        <span className="ml-2 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-sm">
          {state.retryQueue.length} pending
        </span>
      </div>

      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {state.retryQueue.map((tx) => {
            const lastStage = tx.stages[tx.stages.length - 1];
            
            return (
              <motion.div
                key={tx.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-center justify-between bg-gray-800/50 rounded-lg border border-gray-700 p-4"
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-lg bg-red-500/20 text-red-400">
                    <RefreshCw className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-white font-mono text-sm">{tx.id.slice(0, 20)}...</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-400 mt-1">
                      <span className="flex items-center gap-1">
                        <DollarSign className="w-3 h-3" />
                        ${tx.amount.toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1 text-red-400">
                        <AlertTriangle className="w-3 h-3" />
                        {lastStage?.message || 'Failed'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Failed at {lastStage?.stage.replace('_', ' ')}
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => retryTransaction(tx.id)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 font-medium text-sm transition-colors"
                  >
                    <Play className="w-3 h-3" />
                    Retry
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
