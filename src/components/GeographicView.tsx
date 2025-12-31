'use client';

import { usePipeline } from '@/context/PipelineContext';
import { motion } from 'framer-motion';
import { MapPin, Building2, ArrowRight } from 'lucide-react';

const regions = [
  { id: 'na', name: 'North America', lat: 40, lng: -100, color: '#3b82f6' },
  { id: 'eu', name: 'Europe', lat: 50, lng: 10, color: '#8b5cf6' },
  { id: 'asia', name: 'Asia Pacific', lat: 35, lng: 105, color: '#06b6d4' },
  { id: 'sa', name: 'South America', lat: -15, lng: -60, color: '#10b981' },
];

export function GeographicView() {
  const { state } = usePipeline();
  const { transactions } = state;

  // Count transactions by "region" (simulated)
  const regionCounts = regions.map(region => ({
    ...region,
    count: transactions.filter((_, i) => i % regions.length === regions.indexOf(region)).length,
  }));

  const totalActive = regionCounts.reduce((sum, r) => sum + r.count, 0);

  return (
    <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-4">
      <div className="flex items-center gap-2 mb-4">
        <MapPin className="w-4 h-4 text-cyan-400" />
        <span className="text-sm font-medium text-gray-300">Geographic Distribution</span>
      </div>

      {/* Simplified world map representation */}
      <div className="relative h-32 bg-gray-800/50 rounded-lg overflow-hidden mb-4">
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }}
        />

        {/* Region dots */}
        {regionCounts.map(region => (
          <motion.div
            key={region.id}
            className="absolute"
            style={{
              left: `${((region.lng + 180) / 360) * 100}%`,
              top: `${((90 - region.lat) / 180) * 100}%`,
            }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
          >
            <div className="relative">
              {/* Pulse */}
              {region.count > 0 && (
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{ backgroundColor: region.color }}
                  animate={{ scale: [1, 2, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}
              {/* Dot */}
              <div
                className="w-3 h-3 rounded-full relative z-10"
                style={{ backgroundColor: region.color }}
              />
              {/* Count badge */}
              {region.count > 0 && (
                <span
                  className="absolute -top-1 -right-1 text-[8px] bg-white text-black font-bold rounded-full w-4 h-4 flex items-center justify-center"
                >
                  {region.count > 9 ? '9+' : region.count}
                </span>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Region list */}
      <div className="space-y-2">
        {regionCounts.map(region => (
          <div key={region.id} className="flex items-center gap-3">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: region.color }}
            />
            <span className="text-xs text-gray-400 flex-1">{region.name}</span>
            <span className="text-xs text-gray-500">{region.count} tx</span>
            <div className="w-16 bg-gray-800 rounded-full h-1.5">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: region.color }}
                initial={{ width: 0 }}
                animate={{ 
                  width: totalActive > 0 
                    ? `${(region.count / totalActive) * 100}%` 
                    : '0%' 
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
