'use client';

import { motion } from 'framer-motion';
import { usePipeline } from '@/context/PipelineContext';

export function PipelineHealth() {
  const { state } = usePipeline();
  
  const successRate = state.metrics.throughput;
  const avgLatency = state.metrics.avgProcessingTime;
  const queueSize = state.retryQueue.length;
  
  // Calculate health score 0-100
  const calculateHealth = () => {
    let score = 100;
    
    // Deduct for low success rate
    if (successRate < 95) score -= (95 - successRate) * 2;
    
    // Deduct for high latency (over 2000ms is bad)
    if (avgLatency > 2000) score -= Math.min(20, (avgLatency - 2000) / 100);
    
    // Deduct for retry queue buildup
    score -= Math.min(30, queueSize * 5);
    
    return Math.max(0, Math.round(score));
  };
  
  const health = calculateHealth();
  
  const getHealthColor = () => {
    if (health >= 90) return 'text-green-400';
    if (health >= 70) return 'text-yellow-400';
    if (health >= 50) return 'text-orange-400';
    return 'text-red-400';
  };
  
  const getHealthLabel = () => {
    if (health >= 90) return 'Excellent';
    if (health >= 70) return 'Good';
    if (health >= 50) return 'Fair';
    return 'Critical';
  };

  return (
    <div className="flex items-center gap-3">
      <div className="relative w-12 h-12">
        <svg className="w-12 h-12 -rotate-90">
          <circle
            cx="24"
            cy="24"
            r="20"
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
            className="text-gray-800"
          />
          <motion.circle
            cx="24"
            cy="24"
            r="20"
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
            className={getHealthColor()}
            initial={{ strokeDasharray: '0 126' }}
            animate={{ strokeDasharray: `${(health / 100) * 126} 126` }}
            transition={{ duration: 0.5 }}
          />
        </svg>
        <div className={`absolute inset-0 flex items-center justify-center text-sm font-bold ${getHealthColor()}`}>
          {health}
        </div>
      </div>
      <div>
        <div className={`font-semibold ${getHealthColor()}`}>{getHealthLabel()}</div>
        <div className="text-xs text-gray-500">Pipeline Health</div>
      </div>
    </div>
  );
}
