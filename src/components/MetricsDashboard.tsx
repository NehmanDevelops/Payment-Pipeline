'use client';

import { motion } from 'framer-motion';
import { 
  Activity, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  XCircle,
  Zap
} from 'lucide-react';
import { usePipeline } from '@/context/PipelineContext';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  color: string;
  trend?: number;
}

function MetricCard({ title, value, subtitle, icon, color, trend }: MetricCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-800/50 rounded-xl border border-gray-700 p-4"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-400 text-sm">{title}</p>
          <p className={`text-2xl font-bold mt-1 ${color}`}>{value}</p>
          {subtitle && <p className="text-gray-500 text-xs mt-1">{subtitle}</p>}
        </div>
        <div className={`p-2 rounded-lg bg-gray-700/50 ${color}`}>
          {icon}
        </div>
      </div>
      {trend !== undefined && (
        <div className="mt-3 flex items-center gap-1 text-xs">
          <TrendingUp className={`w-3 h-3 ${trend >= 0 ? 'text-green-400' : 'text-red-400'}`} />
          <span className={trend >= 0 ? 'text-green-400' : 'text-red-400'}>
            {trend >= 0 ? '+' : ''}{trend}%
          </span>
          <span className="text-gray-500">vs avg</span>
        </div>
      )}
    </motion.div>
  );
}

export function MetricsDashboard() {
  const { state } = usePipeline();
  const { metrics } = state;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
      <MetricCard
        title="Total Transactions"
        value={metrics.totalTransactions}
        icon={<Activity className="w-5 h-5" />}
        color="text-blue-400"
      />
      <MetricCard
        title="Successful"
        value={metrics.successfulTransactions}
        subtitle={`${metrics.throughput}% success rate`}
        icon={<CheckCircle className="w-5 h-5" />}
        color="text-green-400"
      />
      <MetricCard
        title="Failed"
        value={metrics.failedTransactions}
        subtitle="Moved to retry queue"
        icon={<XCircle className="w-5 h-5" />}
        color="text-red-400"
      />
      <MetricCard
        title="Avg Processing"
        value={`${metrics.avgProcessingTime}ms`}
        subtitle="End-to-end latency"
        icon={<Clock className="w-5 h-5" />}
        color="text-purple-400"
      />
      <MetricCard
        title="Retry Queue"
        value={state.retryQueue.length}
        subtitle="Awaiting retry"
        icon={<Zap className="w-5 h-5" />}
        color="text-yellow-400"
      />
    </div>
  );
}
