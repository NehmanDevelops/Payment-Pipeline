'use client';

import { motion } from 'framer-motion';
import { 
  Clock,
  Calendar,
  Activity
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { usePipeline } from '@/context/PipelineContext';

export function SessionStats() {
  const { state } = usePipeline();
  const [sessionStart] = useState(new Date());
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - sessionStart.getTime()) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [sessionStart]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const txPerMinute = elapsed > 0 
    ? Math.round((state.metrics.totalTransactions / (elapsed / 60)) * 10) / 10
    : 0;

  return (
    <div className="flex items-center gap-6 text-sm text-gray-400">
      <div className="flex items-center gap-2">
        <Clock className="w-4 h-4" />
        <span>Session: {formatTime(elapsed)}</span>
      </div>
      <div className="flex items-center gap-2">
        <Activity className="w-4 h-4" />
        <span>{txPerMinute} tx/min</span>
      </div>
      <div className="flex items-center gap-2">
        <Calendar className="w-4 h-4" />
        <span>{sessionStart.toLocaleTimeString()}</span>
      </div>
    </div>
  );
}
