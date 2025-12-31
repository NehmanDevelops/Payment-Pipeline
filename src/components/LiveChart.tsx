'use client';

import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown,
  Activity,
  BarChart3
} from 'lucide-react';
import { usePipeline } from '@/context/PipelineContext';
import { useEffect, useState } from 'react';

interface DataPoint {
  timestamp: number;
  throughput: number;
  latency: number;
  failures: number;
}

export function LiveChart() {
  const { state } = usePipeline();
  const [dataPoints, setDataPoints] = useState<DataPoint[]>([]);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setDataPoints((prev) => {
        const newPoint: DataPoint = {
          timestamp: Date.now(),
          throughput: state.metrics.throughput,
          latency: state.metrics.avgProcessingTime,
          failures: state.metrics.failedTransactions,
        };
        
        const updated = [...prev, newPoint].slice(-20); // Keep last 20 points
        return updated;
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, [state.metrics]);

  const maxThroughput = Math.max(...dataPoints.map((d) => d.throughput), 100);
  const maxLatency = Math.max(...dataPoints.map((d) => d.latency), 1000);
  
  const throughputTrend = dataPoints.length > 1 
    ? dataPoints[dataPoints.length - 1]?.throughput - dataPoints[dataPoints.length - 2]?.throughput 
    : 0;

  return (
    <div className="bg-gray-900/50 rounded-2xl border border-gray-800 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-cyan-400" />
          <h2 className="text-xl font-bold text-white">Live Metrics</h2>
        </div>
        <div className="flex items-center gap-2 text-sm">
          {throughputTrend >= 0 ? (
            <span className="flex items-center gap-1 text-green-400">
              <TrendingUp className="w-4 h-4" />
              Healthy
            </span>
          ) : (
            <span className="flex items-center gap-1 text-red-400">
              <TrendingDown className="w-4 h-4" />
              Degraded
            </span>
          )}
        </div>
      </div>
      
      {/* Throughput Chart */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-400">Success Rate</span>
          <span className="text-sm text-green-400 font-mono">{state.metrics.throughput}%</span>
        </div>
        <div className="h-16 flex items-end gap-1">
          {dataPoints.map((point, index) => (
            <motion.div
              key={point.timestamp}
              className="flex-1 bg-gradient-to-t from-green-600 to-green-400 rounded-t"
              initial={{ height: 0 }}
              animate={{ height: `${(point.throughput / maxThroughput) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          ))}
          {dataPoints.length === 0 && (
            <div className="flex-1 flex items-center justify-center text-gray-500 text-sm">
              <Activity className="w-4 h-4 mr-2 animate-pulse" />
              Collecting data...
            </div>
          )}
        </div>
      </div>
      
      {/* Latency Chart */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-400">Avg Latency</span>
          <span className="text-sm text-purple-400 font-mono">{state.metrics.avgProcessingTime}ms</span>
        </div>
        <div className="h-12 flex items-end gap-1">
          {dataPoints.map((point) => (
            <motion.div
              key={`latency-${point.timestamp}`}
              className="flex-1 bg-gradient-to-t from-purple-600 to-purple-400 rounded-t"
              initial={{ height: 0 }}
              animate={{ height: `${Math.min((point.latency / maxLatency) * 100, 100)}%` }}
              transition={{ duration: 0.3 }}
            />
          ))}
        </div>
      </div>
      
      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-4 text-xs text-gray-500">
        <span className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-green-500" />
          Throughput
        </span>
        <span className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-purple-500" />
          Latency
        </span>
      </div>
    </div>
  );
}
