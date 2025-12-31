'use client';

import { usePipeline } from '@/context/PipelineContext';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, TrendingDown, Minus } from 'lucide-react';

export function ComparisonChart() {
  const { state } = usePipeline();
  const { metrics } = state;

  const comparisons = [
    {
      label: 'Processing Speed',
      current: metrics.avgProcessingTime,
      baseline: 1500,
      unit: 'ms',
      lowerBetter: true,
    },
    {
      label: 'Success Rate',
      current: metrics.totalTransactions > 0 ? (metrics.successfulTransactions / metrics.totalTransactions) * 100 : 0,
      baseline: 95,
      unit: '%',
      lowerBetter: false,
    },
    {
      label: 'Fraud Detection',
      current: metrics.totalTransactions > 0 ? (metrics.failedTransactions / metrics.totalTransactions) * 100 : 0,
      baseline: 3,
      unit: '%',
      lowerBetter: false, // we want high detection
    },
    {
      label: 'Throughput',
      current: metrics.throughput,
      baseline: 25,
      unit: '/min',
      lowerBetter: false,
    },
  ];

  const getTrend = (current: number, baseline: number, lowerBetter: boolean) => {
    const diff = ((current - baseline) / baseline) * 100;
    if (Math.abs(diff) < 5) return { icon: <Minus className="w-3 h-3" />, color: 'text-gray-400', text: 'Stable' };
    
    if (lowerBetter) {
      if (diff < 0) return { icon: <TrendingDown className="w-3 h-3" />, color: 'text-green-400', text: `${Math.abs(diff).toFixed(0)}% faster` };
      return { icon: <TrendingUp className="w-3 h-3" />, color: 'text-red-400', text: `${diff.toFixed(0)}% slower` };
    } else {
      if (diff > 0) return { icon: <TrendingUp className="w-3 h-3" />, color: 'text-green-400', text: `+${diff.toFixed(0)}%` };
      return { icon: <TrendingDown className="w-3 h-3" />, color: 'text-red-400', text: `${diff.toFixed(0)}%` };
    }
  };

  return (
    <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-4">
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 className="w-4 h-4 text-purple-400" />
        <span className="text-sm font-medium text-gray-300">vs Industry Baseline</span>
      </div>

      <div className="space-y-4">
        {comparisons.map(comp => {
          const trend = getTrend(comp.current, comp.baseline, comp.lowerBetter);
          const percentage = Math.min((comp.current / (comp.baseline * 2)) * 100, 100);
          const baselinePos = 50; // baseline at 50% mark

          return (
            <div key={comp.label}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-gray-400">{comp.label}</span>
                <div className={`flex items-center gap-1 text-xs ${trend.color}`}>
                  {trend.icon}
                  <span>{trend.text}</span>
                </div>
              </div>
              
              <div className="relative h-4 bg-gray-800 rounded-full overflow-hidden">
                {/* Baseline marker */}
                <div 
                  className="absolute top-0 bottom-0 w-0.5 bg-gray-500 z-10"
                  style={{ left: `${baselinePos}%` }}
                />
                
                {/* Current value bar */}
                <motion.div
                  className={`h-full rounded-full ${
                    trend.color === 'text-green-400' ? 'bg-green-500/50' :
                    trend.color === 'text-red-400' ? 'bg-red-500/50' :
                    'bg-gray-600'
                  }`}
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              
              <div className="flex justify-between mt-1">
                <span className="text-[10px] text-gray-500">
                  Current: {comp.current.toFixed(comp.unit === '%' ? 1 : 0)}{comp.unit}
                </span>
                <span className="text-[10px] text-gray-500">
                  Baseline: {comp.baseline}{comp.unit}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
