'use client';

import { motion } from 'framer-motion';
import { 
  Clock, 
  Zap, 
  Target,
  ArrowRight,
  Timer
} from 'lucide-react';
import { usePipeline } from '@/context/PipelineContext';
import { STAGE_NAMES, STAGE_DESCRIPTIONS } from '@/lib/constants';

export function StageDetails() {
  const { state } = usePipeline();
  
  const stages = [
    'initiated',
    'fraud_check', 
    'balance_verify',
    'processing',
    'settlement'
  ];
  
  // Calculate stats per stage
  const stageStats = stages.map((stage) => {
    const stagesData = state.transactions.flatMap((t) => 
      t.stages.filter((s) => s.stage === stage)
    );
    
    const successCount = stagesData.filter((s) => s.success).length;
    const failCount = stagesData.filter((s) => !s.success).length;
    const totalLatency = stagesData.reduce((sum, s) => sum + (s.latency || 0), 0);
    const avgLatency = stagesData.length > 0 ? Math.round(totalLatency / stagesData.length) : 0;
    
    return {
      stage,
      name: STAGE_NAMES[stage],
      description: STAGE_DESCRIPTIONS[stage],
      successCount,
      failCount,
      avgLatency,
      successRate: stagesData.length > 0 
        ? Math.round((successCount / stagesData.length) * 100) 
        : 100,
    };
  });

  return (
    <div className="bg-gray-900/50 rounded-2xl border border-gray-800 p-6">
      <div className="flex items-center gap-2 mb-6">
        <Target className="w-5 h-5 text-purple-400" />
        <h2 className="text-xl font-bold text-white">Stage Performance</h2>
      </div>
      
      <div className="space-y-4">
        {stageStats.map((stage, index) => (
          <motion.div
            key={stage.stage}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gray-800/50 rounded-lg p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gray-700 flex items-center justify-center text-sm font-bold text-gray-300">
                  {index + 1}
                </div>
                <div>
                  <h3 className="font-semibold text-white">{stage.name}</h3>
                  <p className="text-xs text-gray-500">{stage.description}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1 text-gray-400">
                  <Timer className="w-4 h-4" />
                  <span className="font-mono">{stage.avgLatency}ms</span>
                </div>
                <div className={`font-semibold ${
                  stage.successRate >= 95 ? 'text-green-400' : 
                  stage.successRate >= 80 ? 'text-yellow-400' : 'text-red-400'
                }`}>
                  {stage.successRate}%
                </div>
              </div>
            </div>
            
            {/* Progress bar */}
            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                className={`h-full rounded-full ${
                  stage.successRate >= 95 ? 'bg-green-500' : 
                  stage.successRate >= 80 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                initial={{ width: 0 }}
                animate={{ width: `${stage.successRate}%` }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              />
            </div>
            
            <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <Zap className="w-3 h-3 text-green-400" />
                {stage.successCount} passed
              </span>
              {stage.failCount > 0 && (
                <span className="text-red-400">
                  {stage.failCount} failed
                </span>
              )}
            </div>
            
            {index < stageStats.length - 1 && (
              <div className="flex justify-center mt-2">
                <ArrowRight className="w-4 h-4 text-gray-600" />
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
