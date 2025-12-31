'use client';

import { motion } from 'framer-motion';
import { 
  DollarSign,
  ArrowUpRight,
  ArrowDownLeft,
  CreditCard,
  Wallet,
  TrendingUp
} from 'lucide-react';
import { usePipeline } from '@/context/PipelineContext';
import { TransactionType } from '@/types';

const typeConfig: Record<TransactionType, { icon: React.ReactNode; color: string; label: string }> = {
  transfer: { icon: <ArrowUpRight className="w-5 h-5" />, color: 'text-blue-400', label: 'Transfers' },
  payment: { icon: <CreditCard className="w-5 h-5" />, color: 'text-green-400', label: 'Payments' },
  deposit: { icon: <ArrowDownLeft className="w-5 h-5" />, color: 'text-purple-400', label: 'Deposits' },
  withdrawal: { icon: <Wallet className="w-5 h-5" />, color: 'text-orange-400', label: 'Withdrawals' },
};

export function TransactionTypeBreakdown() {
  const { state } = usePipeline();
  
  const typeStats = (Object.keys(typeConfig) as TransactionType[]).map((type) => {
    const transactions = state.transactions.filter((t) => t.type === type);
    const totalAmount = transactions.reduce((sum, t) => sum + t.amount, 0);
    const completed = transactions.filter((t) => t.status === 'completed').length;
    
    return {
      type,
      count: transactions.length,
      totalAmount,
      completed,
      successRate: transactions.length > 0 
        ? Math.round((completed / transactions.length) * 100) 
        : 0,
      ...typeConfig[type],
    };
  });

  const totalVolume = typeStats.reduce((sum, t) => sum + t.totalAmount, 0);

  return (
    <div className="bg-gray-900/50 rounded-2xl border border-gray-800 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-green-400" />
          <h2 className="text-xl font-bold text-white">Transaction Volume</h2>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-green-400">
            ${totalVolume.toLocaleString('en-CA', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-xs text-gray-500">Total Volume</div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        {typeStats.map((stat, index) => (
          <motion.div
            key={stat.type}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gray-800/50 rounded-lg p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className={stat.color}>{stat.icon}</div>
              <span className="text-gray-300 font-medium">{stat.label}</span>
            </div>
            
            <div className="text-xl font-bold text-white mb-1">
              {stat.count}
            </div>
            
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">
                ${stat.totalAmount.toLocaleString('en-CA', { minimumFractionDigits: 0 })}
              </span>
              <span className={stat.successRate >= 90 ? 'text-green-400' : 'text-yellow-400'}>
                {stat.successRate}% success
              </span>
            </div>
            
            {/* Mini bar */}
            <div className="mt-2 h-1 bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                className={`h-full rounded-full ${
                  stat.type === 'transfer' ? 'bg-blue-500' :
                  stat.type === 'payment' ? 'bg-green-500' :
                  stat.type === 'deposit' ? 'bg-purple-500' : 'bg-orange-500'
                }`}
                initial={{ width: 0 }}
                animate={{ width: `${totalVolume > 0 ? (stat.totalAmount / totalVolume) * 100 : 0}%` }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
