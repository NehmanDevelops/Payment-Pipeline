'use client';

import { motion } from 'framer-motion';
import { 
  Play, 
  Pause, 
  Plus, 
  Trash2, 
  Gauge,
  RefreshCw
} from 'lucide-react';
import { usePipeline } from '@/context/PipelineContext';

export function ControlPanel() {
  const { state, toggleRunning, addTransaction, setSpeed, clearCompleted, retryTransaction } = usePipeline();

  const speeds = [
    { value: 0.5, label: '0.5x' },
    { value: 1, label: '1x' },
    { value: 2, label: '2x' },
    { value: 4, label: '4x' },
  ];

  return (
    <div className="bg-gray-900/50 rounded-2xl border border-gray-800 p-4">
      <div className="flex flex-wrap items-center gap-4">
        {/* Play/Pause */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleRunning}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors ${
            state.isRunning
              ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
              : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
          }`}
        >
          {state.isRunning ? (
            <>
              <Pause className="w-4 h-4" />
              Pause
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              Resume
            </>
          )}
        </motion.button>

        {/* Add Transaction */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={addTransaction}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30 font-semibold transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Transaction
        </motion.button>

        {/* Speed Control */}
        <div className="flex items-center gap-2 bg-gray-800 rounded-lg p-1">
          <Gauge className="w-4 h-4 text-gray-400 ml-2" />
          {speeds.map((s) => (
            <button
              key={s.value}
              onClick={() => setSpeed(s.value)}
              className={`px-3 py-1 rounded-md text-sm transition-colors ${
                state.speed === s.value
                  ? 'bg-yellow-500 text-black font-semibold'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Clear Completed */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={clearCompleted}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          Clear Done
        </motion.button>

        {/* Retry Queue */}
        {state.retryQueue.length > 0 && (
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-gray-400 text-sm">
              {state.retryQueue.length} in retry queue
            </span>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                state.retryQueue.forEach((tx) => retryTransaction(tx.id));
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 font-semibold transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Retry All
            </motion.button>
          </div>
        )}
      </div>
    </div>
  );
}
