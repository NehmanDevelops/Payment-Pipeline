'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HelpCircle, X, Play, Pause, RotateCcw, 
  Gauge, Shield, DollarSign, ArrowRight,
  Keyboard, Trophy, Terminal, MapPin
} from 'lucide-react';

export function InstructionsModal() {
  const [isOpen, setIsOpen] = useState(false);

  const features = [
    {
      icon: <Play className="w-4 h-4" />,
      title: 'Start/Pause Pipeline',
      description: 'Click the Play button or press Space to start processing transactions. Click again to pause.',
    },
    {
      icon: <Gauge className="w-4 h-4" />,
      title: 'Adjust Speed',
      description: 'Use the speed slider or press 1-3 keys to control how fast transactions flow through.',
    },
    {
      icon: <Shield className="w-4 h-4" />,
      title: 'Fraud Detection',
      description: 'Watch transactions get flagged in real-time based on ML fraud scores. High-risk ones turn red.',
    },
    {
      icon: <RotateCcw className="w-4 h-4" />,
      title: 'Retry Queue',
      description: 'Failed transactions go to the retry queue. Click retry to reprocess them through the pipeline.',
    },
    {
      icon: <Trophy className="w-4 h-4" />,
      title: 'Milestones',
      description: 'Unlock achievements as you process more transactions and maintain high success rates.',
    },
    {
      icon: <Terminal className="w-4 h-4" />,
      title: 'System Logs',
      description: 'Expand the logs panel to see detailed terminal-style output of every pipeline event.',
    },
  ];

  const stages = [
    { name: 'Initiated', desc: 'Transaction enters the system' },
    { name: 'Fraud Check', desc: 'ML model analyzes for suspicious patterns' },
    { name: 'Balance Verify', desc: 'Confirms sufficient funds available' },
    { name: 'Processing', desc: 'Core banking operations execute' },
    { name: 'Settlement', desc: 'Funds transferred and finalized' },
  ];

  return (
    <>
      {/* Trigger Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-800 text-gray-300 hover:text-white hover:bg-gray-700 transition-colors text-sm"
      >
        <HelpCircle className="w-4 h-4" />
        How to Use
      </motion.button>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]"
            />

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed z-[101] top-[5%] left-[50%] translate-x-[-50%] w-[90%] max-w-[700px] max-h-[90vh] bg-gray-900 rounded-2xl border border-gray-800 shadow-2xl overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-800">
                <div>
                  <h2 className="text-xl font-bold text-white">Payment Pipeline Visualizer</h2>
                  <p className="text-sm text-gray-400 mt-1">Interactive banking infrastructure demo</p>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* What is this */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">What is this?</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    This is a real-time visualization of how payments flow through a modern banking system. 
                    It demonstrates the key stages of payment processing including fraud detection, 
                    balance verification, and settlement — the same concepts used by banks like RBC, 
                    TD, and major payment processors worldwide.
                  </p>
                </div>

                {/* Pipeline Stages */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Pipeline Stages</h3>
                  <div className="flex flex-wrap items-center gap-2">
                    {stages.map((stage, i) => (
                      <div key={stage.name} className="flex items-center gap-2">
                        <div className="bg-gray-800 rounded-lg px-3 py-2">
                          <span className="text-xs font-medium text-white">{stage.name}</span>
                          <p className="text-[10px] text-gray-500">{stage.desc}</p>
                        </div>
                        {i < stages.length - 1 && (
                          <ArrowRight className="w-4 h-4 text-gray-600" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Features */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Features & Controls</h3>
                  <div className="grid md:grid-cols-2 gap-3">
                    {features.map((feature) => (
                      <div
                        key={feature.title}
                        className="flex gap-3 p-3 bg-gray-800/50 rounded-lg border border-gray-700"
                      >
                        <div className="p-2 bg-yellow-500/20 rounded-lg text-yellow-400 h-fit">
                          {feature.icon}
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-white">{feature.title}</h4>
                          <p className="text-xs text-gray-400 mt-0.5">{feature.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Keyboard Shortcuts */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Keyboard Shortcuts</h3>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { key: 'Space', action: 'Play/Pause' },
                      { key: 'R', action: 'Reset' },
                      { key: '1', action: 'Slow' },
                      { key: '2', action: 'Normal' },
                      { key: '3', action: 'Fast' },
                      { key: '?', action: 'Help' },
                    ].map(({ key, action }) => (
                      <div key={key} className="flex items-center gap-2 bg-gray-800 rounded-lg px-3 py-1.5">
                        <kbd className="px-2 py-0.5 bg-gray-700 rounded text-xs font-mono text-white">{key}</kbd>
                        <span className="text-xs text-gray-400">{action}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tech Stack */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Built With</h3>
                  <div className="flex flex-wrap gap-2">
                    {['Next.js 14', 'React', 'TypeScript', 'Tailwind CSS', 'Framer Motion'].map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-gray-800 bg-gray-800/50">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-500">
                    Created by Nehman • Demonstrating enterprise banking concepts
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-2 bg-yellow-500 hover:bg-yellow-400 text-black font-medium rounded-lg text-sm transition-colors"
                  >
                    Got it, let's go!
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
