'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePipeline } from '@/context/PipelineContext';
import { Settings, Sliders, Gauge, AlertTriangle, Zap } from 'lucide-react';

interface SettingItem {
  id: string;
  label: string;
  description: string;
  type: 'toggle' | 'slider' | 'select';
  value: boolean | number | string;
  options?: string[];
  min?: number;
  max?: number;
}

export function SettingsPanel() {
  const { state } = usePipeline();
  const [isOpen, setIsOpen] = useState(false);
  
  const [settings, setSettings] = useState<SettingItem[]>([
    {
      id: 'autoRetry',
      label: 'Auto Retry',
      description: 'Automatically retry failed transactions',
      type: 'toggle',
      value: true,
    },
    {
      id: 'fraudThreshold',
      label: 'Fraud Threshold',
      description: 'Score above which transactions are flagged',
      type: 'slider',
      value: 70,
      min: 50,
      max: 95,
    },
    {
      id: 'batchSize',
      label: 'Batch Size',
      description: 'Transactions per batch',
      type: 'select',
      value: '10',
      options: ['5', '10', '25', '50'],
    },
    {
      id: 'realTimeAlerts',
      label: 'Real-time Alerts',
      description: 'Show notifications for important events',
      type: 'toggle',
      value: true,
    },
    {
      id: 'soundEffects',
      label: 'Sound Effects',
      description: 'Play sounds on transaction events',
      type: 'toggle',
      value: false,
    },
  ]);

  const updateSetting = (id: string, value: boolean | number | string) => {
    setSettings(prev => prev.map(s => s.id === id ? { ...s, value } : s));
  };

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`p-2 rounded-lg transition-colors ${
          isOpen ? 'bg-blue-500/20 text-blue-400' : 'bg-gray-800 text-gray-400 hover:text-white'
        }`}
      >
        <Settings className="w-5 h-5" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-40"
            />

            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="absolute right-0 top-12 w-80 bg-gray-900 rounded-xl border border-gray-800 shadow-xl z-50 overflow-hidden"
            >
              <div className="p-4 border-b border-gray-800">
                <div className="flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-blue-400" />
                  <span className="font-medium">Pipeline Settings</span>
                </div>
              </div>

              <div className="p-4 space-y-4 max-h-96 overflow-y-auto">
                {settings.map(setting => (
                  <div key={setting.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">{setting.label}</label>
                      
                      {setting.type === 'toggle' && (
                        <button
                          onClick={() => updateSetting(setting.id, !setting.value)}
                          className={`w-10 h-5 rounded-full transition-colors ${
                            setting.value ? 'bg-blue-500' : 'bg-gray-700'
                          }`}
                        >
                          <motion.div
                            className="w-4 h-4 bg-white rounded-full shadow"
                            animate={{ x: setting.value ? 20 : 2 }}
                            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                          />
                        </button>
                      )}
                    </div>
                    
                    <p className="text-xs text-gray-500">{setting.description}</p>

                    {setting.type === 'slider' && (
                      <div className="flex items-center gap-3">
                        <input
                          type="range"
                          min={setting.min}
                          max={setting.max}
                          value={setting.value as number}
                          onChange={(e) => updateSetting(setting.id, Number(e.target.value))}
                          className="flex-1 h-1 bg-gray-700 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-blue-500 [&::-webkit-slider-thumb]:rounded-full"
                        />
                        <span className="text-xs text-gray-400 w-8">{setting.value}%</span>
                      </div>
                    )}

                    {setting.type === 'select' && (
                      <select
                        value={setting.value as string}
                        onChange={(e) => updateSetting(setting.id, e.target.value)}
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500"
                      >
                        {setting.options?.map(opt => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    )}
                  </div>
                ))}
              </div>

              <div className="p-4 border-t border-gray-800 bg-gray-800/50">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <AlertTriangle className="w-3 h-3" />
                  <span>Settings apply to current session only</span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
