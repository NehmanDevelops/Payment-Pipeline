'use client';

import { motion } from 'framer-motion';
import { usePipeline } from '@/context/PipelineContext';
import { Bot, Sparkles, TrendingUp, AlertTriangle, Target, Lightbulb } from 'lucide-react';

export function AIInsights() {
  const { state } = usePipeline();
  const { metrics, transactions } = state;

  const generateInsights = () => {
    const insights: { icon: React.ReactNode; text: string; type: 'info' | 'warning' | 'success' }[] = [];
    
    // success rate insight
    const successRate = metrics.totalTransactions > 0 
      ? (metrics.successfulTransactions / metrics.totalTransactions) * 100 
      : 0;
    
    if (successRate > 95) {
      insights.push({
        icon: <TrendingUp className="w-4 h-4" />,
        text: `Pipeline is performing excellently with a ${successRate.toFixed(1)}% success rate`,
        type: 'success',
      });
    } else if (successRate < 85 && metrics.totalTransactions > 5) {
      insights.push({
        icon: <AlertTriangle className="w-4 h-4" />,
        text: `Success rate at ${successRate.toFixed(1)}% - consider reviewing failed transactions`,
        type: 'warning',
      });
    }

    // throughput insight
    if (metrics.throughput > 40) {
      insights.push({
        icon: <Target className="w-4 h-4" />,
        text: `High throughput detected: ${metrics.throughput.toFixed(0)} tx/min - system scaling well`,
        type: 'success',
      });
    }

    // fraud detection insight
    const recentFraud = transactions.filter(t => t.fraudScore > 70).length;
    if (recentFraud > 0) {
      insights.push({
        icon: <AlertTriangle className="w-4 h-4" />,
        text: `${recentFraud} high-risk transactions detected in current batch`,
        type: 'warning',
      });
    }

    // processing time insight
    if (metrics.avgProcessingTime < 1000) {
      insights.push({
        icon: <Sparkles className="w-4 h-4" />,
        text: `Fast processing: avg ${metrics.avgProcessingTime.toFixed(0)}ms per transaction`,
        type: 'success',
      });
    } else if (metrics.avgProcessingTime > 2500) {
      insights.push({
        icon: <Lightbulb className="w-4 h-4" />,
        text: `Processing time is ${metrics.avgProcessingTime.toFixed(0)}ms - consider optimizing fraud checks`,
        type: 'info',
      });
    }

    // default insight if no transactions
    if (metrics.totalTransactions === 0) {
      insights.push({
        icon: <Lightbulb className="w-4 h-4" />,
        text: 'Start the pipeline to begin processing transactions and see AI insights',
        type: 'info',
      });
    }

    return insights.slice(0, 3);
  };

  const insights = generateInsights();

  const getTypeStyles = (type: 'info' | 'warning' | 'success') => {
    switch (type) {
      case 'success':
        return 'bg-green-500/10 border-green-500/30 text-green-400';
      case 'warning':
        return 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400';
      case 'info':
        return 'bg-blue-500/10 border-blue-500/30 text-blue-400';
    }
  };

  return (
    <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-4">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-1.5 rounded-lg bg-purple-500/20">
          <Bot className="w-4 h-4 text-purple-400" />
        </div>
        <span className="text-sm font-medium text-gray-300">AI Insights</span>
        <span className="ml-auto text-xs bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded-full">
          Powered by ML
        </span>
      </div>

      <div className="space-y-2">
        {insights.map((insight, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`flex items-start gap-2 p-3 rounded-lg border ${getTypeStyles(insight.type)}`}
          >
            <div className="mt-0.5">{insight.icon}</div>
            <p className="text-sm">{insight.text}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
