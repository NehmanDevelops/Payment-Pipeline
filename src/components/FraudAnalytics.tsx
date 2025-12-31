'use client';

import { motion } from 'framer-motion';
import { 
  Shield, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Brain,
  TrendingUp
} from 'lucide-react';
import { usePipeline } from '@/context/PipelineContext';

export function FraudAnalytics() {
  const { state } = usePipeline();
  
  const transactions = state.transactions;
  const fraudChecks = transactions.filter((t) => 
    t.stages.some((s) => s.stage === 'fraud_check')
  );
  
  const flaggedTransactions = transactions.filter((t) => t.fraudScore > 50);
  const blockedTransactions = transactions.filter((t) => 
    t.status === 'failed' && t.stages.some((s) => 
      s.stage === 'fraud_check' && !s.success
    )
  );
  
  const avgFraudScore = transactions.length > 0
    ? Math.round(transactions.reduce((sum, t) => sum + t.fraudScore, 0) / transactions.length)
    : 0;

  const riskDistribution = {
    low: transactions.filter((t) => t.fraudScore <= 25).length,
    medium: transactions.filter((t) => t.fraudScore > 25 && t.fraudScore <= 50).length,
    high: transactions.filter((t) => t.fraudScore > 50 && t.fraudScore <= 75).length,
    critical: transactions.filter((t) => t.fraudScore > 75).length,
  };

  const total = transactions.length || 1;

  return (
    <div className="bg-gray-900/50 rounded-2xl border border-gray-800 p-6">
      <div className="flex items-center gap-2 mb-6">
        <Shield className="w-5 h-5 text-orange-400" />
        <h2 className="text-xl font-bold text-white">Fraud Detection Analytics</h2>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-800/50 rounded-lg p-4 text-center">
          <Brain className="w-6 h-6 text-purple-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-white">{fraudChecks.length}</div>
          <div className="text-xs text-gray-400">ML Scans</div>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-4 text-center">
          <AlertTriangle className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-yellow-400">{flaggedTransactions.length}</div>
          <div className="text-xs text-gray-400">Flagged</div>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-4 text-center">
          <XCircle className="w-6 h-6 text-red-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-red-400">{blockedTransactions.length}</div>
          <div className="text-xs text-gray-400">Blocked</div>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-4 text-center">
          <TrendingUp className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-cyan-400">{avgFraudScore}%</div>
          <div className="text-xs text-gray-400">Avg Risk</div>
        </div>
      </div>
      
      {/* Risk Distribution Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-400">Risk Distribution</span>
        </div>
        <div className="h-8 flex rounded-lg overflow-hidden">
          <motion.div 
            className="bg-green-500 flex items-center justify-center text-xs font-bold text-black"
            initial={{ width: 0 }}
            animate={{ width: `${(riskDistribution.low / total) * 100}%` }}
            transition={{ duration: 0.5 }}
          >
            {riskDistribution.low > 0 && riskDistribution.low}
          </motion.div>
          <motion.div 
            className="bg-yellow-500 flex items-center justify-center text-xs font-bold text-black"
            initial={{ width: 0 }}
            animate={{ width: `${(riskDistribution.medium / total) * 100}%` }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {riskDistribution.medium > 0 && riskDistribution.medium}
          </motion.div>
          <motion.div 
            className="bg-orange-500 flex items-center justify-center text-xs font-bold text-black"
            initial={{ width: 0 }}
            animate={{ width: `${(riskDistribution.high / total) * 100}%` }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {riskDistribution.high > 0 && riskDistribution.high}
          </motion.div>
          <motion.div 
            className="bg-red-500 flex items-center justify-center text-xs font-bold text-white"
            initial={{ width: 0 }}
            animate={{ width: `${(riskDistribution.critical / total) * 100}%` }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {riskDistribution.critical > 0 && riskDistribution.critical}
          </motion.div>
        </div>
        <div className="flex justify-between mt-2 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <div className="w-2 h-2 rounded bg-green-500" /> Low (0-25)
          </span>
          <span className="flex items-center gap-1">
            <div className="w-2 h-2 rounded bg-yellow-500" /> Medium (26-50)
          </span>
          <span className="flex items-center gap-1">
            <div className="w-2 h-2 rounded bg-orange-500" /> High (51-75)
          </span>
          <span className="flex items-center gap-1">
            <div className="w-2 h-2 rounded bg-red-500" /> Critical (76-100)
          </span>
        </div>
      </div>
      
      {/* Detection Rate */}
      <div className="bg-gray-800/50 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <span className="text-gray-400">Fraud Detection Rate</span>
          <span className="text-green-400 font-bold">
            {blockedTransactions.length > 0 && flaggedTransactions.length > 0
              ? Math.round((blockedTransactions.length / flaggedTransactions.length) * 100)
              : 100}%
          </span>
        </div>
        <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
          <CheckCircle className="w-4 h-4 text-green-400" />
          All high-risk transactions ({'>'}75 score) automatically blocked
        </div>
      </div>
    </div>
  );
}
