'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Globe, Shield, Zap, Users, TrendingUp, 
  Clock, Server, Cpu, HardDrive, Wifi 
} from 'lucide-react';

interface StatItem {
  label: string;
  value: string;
  icon: React.ReactNode;
  color: string;
}

const globalStats: StatItem[] = [
  { label: 'Active Banks', value: '2,847', icon: <Globe className="w-4 h-4" />, color: 'text-blue-400' },
  { label: 'Countries', value: '142', icon: <Users className="w-4 h-4" />, color: 'text-green-400' },
  { label: 'Daily Volume', value: '$847B', icon: <TrendingUp className="w-4 h-4" />, color: 'text-purple-400' },
  { label: 'Uptime', value: '99.99%', icon: <Server className="w-4 h-4" />, color: 'text-yellow-400' },
  { label: 'Avg Latency', value: '12ms', icon: <Zap className="w-4 h-4" />, color: 'text-cyan-400' },
  { label: 'Fraud Blocked', value: '$2.3M', icon: <Shield className="w-4 h-4" />, color: 'text-red-400' },
];

const systemStats = [
  { label: 'CPU Usage', value: 34, icon: <Cpu className="w-3 h-3" /> },
  { label: 'Memory', value: 67, icon: <HardDrive className="w-3 h-3" /> },
  { label: 'Network', value: 45, icon: <Wifi className="w-3 h-3" /> },
];

export function GlobalStats() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [stats, setStats] = useState(globalStats);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % globalStats.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // simulate live updates
  useEffect(() => {
    const updateInterval = setInterval(() => {
      setStats(prev => prev.map(stat => {
        if (stat.label === 'Daily Volume') {
          const base = 847 + Math.floor(Math.random() * 10);
          return { ...stat, value: `$${base}B` };
        }
        if (stat.label === 'Fraud Blocked') {
          const base = (2.3 + Math.random() * 0.2).toFixed(1);
          return { ...stat, value: `$${base}M` };
        }
        return stat;
      }));
    }, 5000);
    return () => clearInterval(updateInterval);
  }, []);

  return (
    <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-4">
      <div className="flex items-center gap-2 mb-4">
        <Globe className="w-4 h-4 text-blue-400" />
        <span className="text-sm font-medium text-gray-300">Global Network Status</span>
        <span className="ml-auto flex items-center gap-1 text-xs text-green-400">
          <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
          Live
        </span>
      </div>

      {/* Scrolling stats */}
      <div className="relative h-8 overflow-hidden mb-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-2"
          >
            <span className={stats[currentIndex].color}>
              {stats[currentIndex].icon}
            </span>
            <span className="text-gray-400 text-sm">{stats[currentIndex].label}:</span>
            <span className="text-white font-semibold">{stats[currentIndex].value}</span>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Progress indicators */}
      <div className="flex gap-1 mb-4">
        {globalStats.map((_, i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-colors ${
              i === currentIndex ? 'bg-blue-500' : 'bg-gray-700'
            }`}
          />
        ))}
      </div>

      {/* System stats */}
      <div className="space-y-2">
        {systemStats.map(stat => (
          <div key={stat.label} className="flex items-center gap-2">
            <span className="text-gray-500">{stat.icon}</span>
            <span className="text-xs text-gray-400 w-16">{stat.label}</span>
            <div className="flex-1 bg-gray-800 rounded-full h-1.5">
              <motion.div
                className={`h-full rounded-full ${
                  stat.value > 80 ? 'bg-red-500' :
                  stat.value > 60 ? 'bg-yellow-500' : 'bg-green-500'
                }`}
                initial={{ width: 0 }}
                animate={{ width: `${stat.value}%` }}
                transition={{ duration: 1 }}
              />
            </div>
            <span className="text-xs text-gray-500 w-8">{stat.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
