'use client';

import { usePipeline } from '@/context/PipelineContext';
import { motion } from 'framer-motion';
import { 
  Milestone, Clock, TrendingUp, AlertCircle, 
  CheckCircle, XCircle, Trophy 
} from 'lucide-react';

interface Milestone {
  id: string;
  title: string;
  description: string;
  target: number;
  current: number;
  icon: React.ReactNode;
  reward: string;
}

export function MilestoneTracker() {
  const { state } = usePipeline();
  const { metrics } = state;

  const milestones: Milestone[] = [
    {
      id: 'first-100',
      title: 'Getting Started',
      description: 'Process 100 transactions',
      target: 100,
      current: metrics.totalTransactions,
      icon: <TrendingUp className="w-4 h-4" />,
      reward: 'Bronze Badge',
    },
    {
      id: 'success-rate',
      title: 'Reliable Pipeline',
      description: 'Achieve 95% success rate',
      target: 95,
      current: metrics.totalTransactions > 10 ? (metrics.successfulTransactions / metrics.totalTransactions) * 100 : 0,
      icon: <CheckCircle className="w-4 h-4" />,
      reward: 'Reliability Star',
    },
    {
      id: 'fraud-catch',
      title: 'Fraud Hunter',
      description: 'Detect 10 fraudulent transactions',
      target: 10,
      current: metrics.failedTransactions,
      icon: <AlertCircle className="w-4 h-4" />,
      reward: 'Security Shield',
    },
    {
      id: 'speed-demon',
      title: 'Speed Demon',
      description: 'Process 50+ transactions/min',
      target: 50,
      current: metrics.throughput,
      icon: <Clock className="w-4 h-4" />,
      reward: 'Lightning Bolt',
    },
    {
      id: 'big-500',
      title: 'High Volume',
      description: 'Process 500 transactions',
      target: 500,
      current: metrics.totalTransactions,
      icon: <Trophy className="w-4 h-4" />,
      reward: 'Gold Badge',
    },
  ];

  return (
    <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-4">
      <div className="flex items-center gap-2 mb-4">
        <Milestone className="w-4 h-4 text-yellow-400" />
        <span className="text-sm font-medium text-gray-300">Milestones</span>
        <span className="ml-auto text-xs text-gray-500">
          {milestones.filter(m => m.current >= m.target).length}/{milestones.length} Complete
        </span>
      </div>

      <div className="space-y-3">
        {milestones.map(milestone => {
          const progress = Math.min((milestone.current / milestone.target) * 100, 100);
          const isComplete = milestone.current >= milestone.target;

          return (
            <motion.div
              key={milestone.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className={`p-3 rounded-lg border ${
                isComplete 
                  ? 'bg-green-500/10 border-green-500/30' 
                  : 'bg-gray-800/50 border-gray-700'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-1.5 rounded-lg ${
                  isComplete ? 'bg-green-500/20 text-green-400' : 'bg-gray-700 text-gray-400'
                }`}>
                  {isComplete ? <CheckCircle className="w-4 h-4" /> : milestone.icon}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-medium ${isComplete ? 'text-green-400' : 'text-white'}`}>
                      {milestone.title}
                    </span>
                    {isComplete && (
                      <span className="text-[10px] bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded">
                        {milestone.reward}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">{milestone.description}</p>
                  
                  {!isComplete && (
                    <div className="mt-2">
                      <div className="flex justify-between text-[10px] text-gray-500 mb-1">
                        <span>{Math.floor(milestone.current)} / {milestone.target}</span>
                        <span>{progress.toFixed(0)}%</span>
                      </div>
                      <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-blue-500"
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          transition={{ duration: 0.5 }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
