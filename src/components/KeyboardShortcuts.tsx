'use client';

import { motion } from 'framer-motion';
import { 
  Keyboard,
  Command,
  X
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { usePipeline } from '@/context/PipelineContext';

export function KeyboardShortcuts() {
  const { toggleRunning, addTransaction, setSpeed, clearCompleted } = usePipeline();
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (e.key.toLowerCase()) {
        case ' ':
          e.preventDefault();
          toggleRunning();
          break;
        case 'n':
          addTransaction();
          break;
        case '1':
          setSpeed(0.5);
          break;
        case '2':
          setSpeed(1);
          break;
        case '3':
          setSpeed(2);
          break;
        case '4':
          setSpeed(4);
          break;
        case 'c':
          clearCompleted();
          break;
        case '?':
          setShowHelp(true);
          break;
        case 'escape':
          setShowHelp(false);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleRunning, addTransaction, setSpeed, clearCompleted]);

  const shortcuts = [
    { key: 'Space', action: 'Play/Pause' },
    { key: 'N', action: 'New Transaction' },
    { key: '1-4', action: 'Set Speed' },
    { key: 'C', action: 'Clear Done' },
    { key: '?', action: 'Show Help' },
    { key: 'Esc', action: 'Close' },
  ];

  return (
    <>
      <button
        onClick={() => setShowHelp(true)}
        className="fixed bottom-4 right-4 p-3 bg-gray-800 rounded-full text-gray-400 hover:text-white hover:bg-gray-700 transition-colors shadow-lg"
        title="Keyboard Shortcuts (?)"
      >
        <Keyboard className="w-5 h-5" />
      </button>

      {showHelp && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          onClick={() => setShowHelp(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gray-900 border border-gray-800 rounded-2xl p-6 max-w-md w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Command className="w-5 h-5 text-yellow-400" />
                <h2 className="text-xl font-bold text-white">Keyboard Shortcuts</h2>
              </div>
              <button
                onClick={() => setShowHelp(false)}
                className="p-1 text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              {shortcuts.map((shortcut) => (
                <div
                  key={shortcut.key}
                  className="flex items-center justify-between py-2 border-b border-gray-800 last:border-0"
                >
                  <span className="text-gray-300">{shortcut.action}</span>
                  <kbd className="px-3 py-1 bg-gray-800 rounded-lg text-yellow-400 font-mono text-sm">
                    {shortcut.key}
                  </kbd>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
}
