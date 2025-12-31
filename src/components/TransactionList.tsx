'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  DollarSign,
  User,
  Building,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';
import { useState } from 'react';
import { usePipeline } from '@/context/PipelineContext';
import { Transaction, TransactionStatus } from '@/types';

const statusConfig: Record<TransactionStatus, { color: string; bgColor: string; icon: React.ReactNode }> = {
  initiated: { color: 'text-blue-400', bgColor: 'bg-blue-500/20', icon: <Clock className="w-4 h-4" /> },
  fraud_check: { color: 'text-orange-400', bgColor: 'bg-orange-500/20', icon: <AlertTriangle className="w-4 h-4" /> },
  balance_verify: { color: 'text-purple-400', bgColor: 'bg-purple-500/20', icon: <DollarSign className="w-4 h-4" /> },
  processing: { color: 'text-cyan-400', bgColor: 'bg-cyan-500/20', icon: <RefreshCw className="w-4 h-4 animate-spin" /> },
  settlement: { color: 'text-yellow-400', bgColor: 'bg-yellow-500/20', icon: <Clock className="w-4 h-4" /> },
  completed: { color: 'text-green-400', bgColor: 'bg-green-500/20', icon: <CheckCircle className="w-4 h-4" /> },
  failed: { color: 'text-red-400', bgColor: 'bg-red-500/20', icon: <XCircle className="w-4 h-4" /> },
  retry_queue: { color: 'text-amber-400', bgColor: 'bg-amber-500/20', icon: <RefreshCw className="w-4 h-4" /> },
};

function TransactionCard({ transaction }: { transaction: Transaction }) {
  const [expanded, setExpanded] = useState(false);
  const config = statusConfig[transaction.status];
  const totalLatency = transaction.stages.reduce((sum, s) => sum + (s.latency || 0), 0);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className="bg-gray-800/50 rounded-lg border border-gray-700 overflow-hidden"
    >
      <div 
        className="p-4 cursor-pointer hover:bg-gray-800/70 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${config.bgColor} ${config.color}`}>
              {config.icon}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-white font-mono text-sm">{transaction.id.slice(0, 20)}...</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${config.bgColor} ${config.color}`}>
                  {transaction.status.replace('_', ' ')}
                </span>
              </div>
              <div className="flex items-center gap-4 text-xs text-gray-400 mt-1">
                <span className="flex items-center gap-1">
                  <User className="w-3 h-3" />
                  {transaction.sender}
                </span>
                <span>→</span>
                <span className="flex items-center gap-1">
                  <Building className="w-3 h-3" />
                  {transaction.recipient}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-white font-semibold">
                ${transaction.amount.toLocaleString('en-CA', { minimumFractionDigits: 2 })}
              </div>
              <div className="text-xs text-gray-400">{transaction.currency}</div>
            </div>
            
            <div className="text-right">
              <div className={`text-sm ${transaction.fraudScore > 50 ? 'text-red-400' : transaction.fraudScore > 25 ? 'text-yellow-400' : 'text-green-400'}`}>
                Risk: {transaction.fraudScore}%
              </div>
              <div className="text-xs text-gray-400">{totalLatency}ms</div>
            </div>
            
            {expanded ? (
              <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </div>
        </div>
      </div>
      
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-gray-700"
          >
            <div className="p-4 space-y-3">
              <h4 className="text-sm font-semibold text-gray-300">Audit Trail</h4>
              <div className="space-y-2">
                {transaction.stages.map((stage, index) => (
                  <div 
                    key={index}
                    className={`flex items-center gap-3 text-sm p-2 rounded-lg ${
                      stage.success ? 'bg-gray-700/50' : 'bg-red-900/20'
                    }`}
                  >
                    <div className={`w-2 h-2 rounded-full ${stage.success ? 'bg-green-400' : 'bg-red-400'}`} />
                    <span className="text-gray-300 font-medium w-28">
                      {stage.stage.replace('_', ' ')}
                    </span>
                    <span className="text-gray-400 flex-1">{stage.message}</span>
                    <span className="text-gray-500 text-xs">{stage.latency}ms</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function TransactionList() {
  const { state } = usePipeline();
  const [filter, setFilter] = useState<'all' | 'active' | 'completed' | 'failed'>('all');

  const filteredTransactions = state.transactions.filter((t) => {
    switch (filter) {
      case 'active':
        return t.status !== 'completed' && t.status !== 'failed';
      case 'completed':
        return t.status === 'completed';
      case 'failed':
        return t.status === 'failed';
      default:
        return true;
    }
  });

  return (
    <div className="bg-gray-900/50 rounded-2xl border border-gray-800 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white">Transactions</h2>
        <div className="flex gap-2">
          {(['all', 'active', 'completed', 'failed'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                filter === f
                  ? 'bg-yellow-500 text-black font-semibold'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>
      
      <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
        <AnimatePresence mode="popLayout">
          {filteredTransactions.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              No transactions to display
            </div>
          ) : (
            filteredTransactions.map((tx) => (
              <TransactionCard key={tx.id} transaction={tx} />
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
