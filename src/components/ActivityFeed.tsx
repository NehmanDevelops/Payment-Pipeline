'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePipeline } from '@/context/PipelineContext';
import { formatCurrency } from '@/lib/utils';
import { 
  Activity, ArrowRight, Clock, CheckCircle, 
  XCircle, AlertTriangle, Zap 
} from 'lucide-react';

interface ActivityItem {
  id: string;
  type: 'completed' | 'failed' | 'flagged' | 'started';
  message: string;
  amount?: number;
  currency?: string;
  timestamp: Date;
}

export function ActivityFeed() {
  const { state } = usePipeline();
  const [activities, setActivities] = useState<ActivityItem[]>([]);

  // track transaction changes
  useEffect(() => {
    const recentTransactions = state.transactions.slice(0, 20);
    
    const newActivities: ActivityItem[] = recentTransactions.map(t => {
      if (t.status === 'completed') {
        return {
          id: `${t.id}-complete`,
          type: 'completed',
          message: `${t.type} from ${t.sender} completed`,
          amount: t.amount,
          currency: t.currency,
          timestamp: new Date(),
        };
      } else if (t.status === 'failed') {
        return {
          id: `${t.id}-failed`,
          type: 'failed',
          message: `${t.type} to ${t.recipient} failed`,
          amount: t.amount,
          currency: t.currency,
          timestamp: new Date(),
        };
      } else if (t.fraudScore >= 70) {
        return {
          id: `${t.id}-flagged`,
          type: 'flagged',
          message: `High risk transaction flagged (${t.fraudScore}% risk)`,
          amount: t.amount,
          currency: t.currency,
          timestamp: new Date(),
        };
      } else {
        return {
          id: `${t.id}-started`,
          type: 'started',
          message: `Processing ${t.type} to ${t.recipient}`,
          amount: t.amount,
          currency: t.currency,
          timestamp: new Date(),
        };
      }
    });

    setActivities(prev => {
      const combined = [...newActivities, ...prev];
      const unique = combined.filter((item, index, self) =>
        index === self.findIndex(i => i.id === item.id)
      );
      return unique.slice(0, 15);
    });
  }, [state.transactions]);

  const getIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'completed':
        return <CheckCircle className="w-3 h-3 text-green-400" />;
      case 'failed':
        return <XCircle className="w-3 h-3 text-red-400" />;
      case 'flagged':
        return <AlertTriangle className="w-3 h-3 text-yellow-400" />;
      case 'started':
        return <Zap className="w-3 h-3 text-blue-400" />;
    }
  };

  const getColor = (type: ActivityItem['type']) => {
    switch (type) {
      case 'completed': return 'border-green-500/30';
      case 'failed': return 'border-red-500/30';
      case 'flagged': return 'border-yellow-500/30';
      case 'started': return 'border-blue-500/30';
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    return `${Math.floor(diff / 3600)}h ago`;
  };

  return (
    <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-4">
      <div className="flex items-center gap-2 mb-4">
        <Activity className="w-4 h-4 text-cyan-400" />
        <span className="text-sm font-medium text-gray-300">Live Activity</span>
        <span className="ml-auto flex items-center gap-1">
          <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
          <span className="text-xs text-gray-500">Live</span>
        </span>
      </div>

      <div className="space-y-2 max-h-64 overflow-y-auto">
        <AnimatePresence initial={false}>
          {activities.length === 0 ? (
            <div className="text-center py-8 text-gray-500 text-sm">
              No activity yet. Start the pipeline to see transactions.
            </div>
          ) : (
            activities.map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20, height: 0 }}
                animate={{ opacity: 1, x: 0, height: 'auto' }}
                exit={{ opacity: 0, x: 20, height: 0 }}
                transition={{ duration: 0.2 }}
                className={`flex items-start gap-2 p-2 rounded-lg border-l-2 bg-gray-800/30 ${getColor(activity.type)}`}
              >
                <div className="mt-0.5">{getIcon(activity.type)}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-300 truncate">{activity.message}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    {activity.amount && (
                      <span className="text-[10px] text-gray-500">
                        {formatCurrency(activity.amount, activity.currency)}
                      </span>
                    )}
                    <span className="text-[10px] text-gray-600">
                      {formatTime(activity.timestamp)}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
