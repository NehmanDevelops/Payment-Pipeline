'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { 
  X,
  Info,
  AlertTriangle,
  CheckCircle,
  Copy,
  ExternalLink
} from 'lucide-react';
import { Transaction } from '@/types';

interface TransactionModalProps {
  transaction: Transaction | null;
  onClose: () => void;
}

export function TransactionModal({ transaction, onClose }: TransactionModalProps) {
  if (!transaction) return null;

  const copyId = () => {
    navigator.clipboard.writeText(transaction.id);
  };

  const totalLatency = transaction.stages.reduce((sum, s) => sum + (s.latency || 0), 0);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-gray-900 border border-gray-800 rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-800">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-white">Transaction Details</h2>
                  <span className={`px-2 py-0.5 rounded-full text-xs ${
                    transaction.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                    transaction.status === 'failed' ? 'bg-red-500/20 text-red-400' :
                    'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {transaction.status}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <code className="text-sm text-gray-400 font-mono">{transaction.id}</code>
                  <button onClick={copyId} className="text-gray-500 hover:text-white">
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <button onClick={onClose} className="text-gray-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[60vh]">
            {/* Summary */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-800/50 rounded-lg p-4">
                <div className="text-sm text-gray-400">Amount</div>
                <div className="text-2xl font-bold text-white">
                  ${transaction.amount.toLocaleString('en-CA', { minimumFractionDigits: 2 })}
                </div>
                <div className="text-xs text-gray-500">{transaction.currency}</div>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-4">
                <div className="text-sm text-gray-400">Risk Score</div>
                <div className={`text-2xl font-bold ${
                  transaction.fraudScore > 75 ? 'text-red-400' :
                  transaction.fraudScore > 50 ? 'text-orange-400' :
                  transaction.fraudScore > 25 ? 'text-yellow-400' : 'text-green-400'
                }`}>
                  {transaction.fraudScore}%
                </div>
                <div className="text-xs text-gray-500">ML Fraud Detection</div>
              </div>
            </div>

            {/* Parties */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-300 mb-3">Parties</h3>
              <div className="flex items-center gap-4">
                <div className="flex-1 bg-gray-800/50 rounded-lg p-3">
                  <div className="text-xs text-gray-500">From</div>
                  <div className="text-white">{transaction.sender}</div>
                </div>
                <div className="text-gray-600">→</div>
                <div className="flex-1 bg-gray-800/50 rounded-lg p-3">
                  <div className="text-xs text-gray-500">To</div>
                  <div className="text-white">{transaction.recipient}</div>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div>
              <h3 className="text-sm font-semibold text-gray-300 mb-3">
                Processing Timeline ({totalLatency}ms total)
              </h3>
              <div className="space-y-2">
                {transaction.stages.map((stage, index) => (
                  <div
                    key={index}
                    className={`flex items-center gap-3 p-3 rounded-lg ${
                      stage.success ? 'bg-gray-800/50' : 'bg-red-900/20 border border-red-500/30'
                    }`}
                  >
                    {stage.success ? (
                      <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <div className="font-medium text-white capitalize">
                        {stage.stage.replace('_', ' ')}
                      </div>
                      <div className="text-sm text-gray-400">{stage.message}</div>
                    </div>
                    <div className="text-sm text-gray-500 font-mono">
                      {stage.latency}ms
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
