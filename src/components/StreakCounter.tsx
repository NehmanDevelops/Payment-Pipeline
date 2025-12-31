'use client';

import { motion } from 'framer-motion';
import { 
  Sparkles,
  Rocket,
  Flame,
  Zap
} from 'lucide-react';
import { usePipeline } from '@/context/PipelineContext';
import { useEffect, useState } from 'react';

export function StreakCounter() {
  const { state } = usePipeline();
  const [streak, setStreak] = useState(0);
  const [highScore, setHighScore] = useState(0);

  useEffect(() => {
    const completed = state.transactions.filter((t) => t.status === 'completed');
    const failed = state.transactions.filter((t) => t.status === 'failed');
    
    // Count consecutive completions from the end
    let currentStreak = 0;
    for (let i = 0; i < state.transactions.length; i++) {
      if (state.transactions[i].status === 'completed') {
        currentStreak++;
      } else if (state.transactions[i].status === 'failed') {
        break;
      }
    }
    
    setStreak(currentStreak);
    if (currentStreak > highScore) {
      setHighScore(currentStreak);
    }
  }, [state.transactions, highScore]);

  const getStreakIcon = () => {
    if (streak >= 20) return <Rocket className="w-5 h-5" />;
    if (streak >= 10) return <Flame className="w-5 h-5" />;
    if (streak >= 5) return <Zap className="w-5 h-5" />;
    return <Sparkles className="w-5 h-5" />;
  };

  const getStreakColor = () => {
    if (streak >= 20) return 'text-purple-400 bg-purple-500/20';
    if (streak >= 10) return 'text-orange-400 bg-orange-500/20';
    if (streak >= 5) return 'text-yellow-400 bg-yellow-500/20';
    return 'text-gray-400 bg-gray-500/20';
  };

  return (
    <motion.div
      key={streak}
      initial={{ scale: 1.2 }}
      animate={{ scale: 1 }}
      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${getStreakColor()}`}
    >
      {getStreakIcon()}
      <span className="font-bold">{streak}</span>
      <span className="text-xs opacity-70">streak</span>
      {highScore > 0 && streak === highScore && streak > 5 && (
        <span className="text-xs bg-yellow-500 text-black px-1 rounded">BEST</span>
      )}
    </motion.div>
  );
}
