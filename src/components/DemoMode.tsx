'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, X, ChevronRight, ChevronLeft, Sparkles } from 'lucide-react';
import { usePipeline } from '@/context/PipelineContext';

interface TourStep {
  id: string;
  target: string; // CSS selector
  title: string;
  description: string;
  position: 'top' | 'bottom' | 'left' | 'right';
  action?: 'click' | 'scroll' | 'highlight' | 'start-pipeline';
  delay?: number;
}

const tourSteps: TourStep[] = [
  {
    id: 'welcome',
    target: '[data-tour="hero"]',
    title: 'Welcome to Payment Pipeline! 👋',
    description: 'This demo will walk you through how modern banking payment systems work. Let\'s explore!',
    position: 'bottom',
    delay: 500,
  },
  {
    id: 'metrics',
    target: '[data-tour="metrics"]',
    title: 'Real-Time Metrics Dashboard',
    description: 'These cards show live statistics: total transactions processed, success rate, failed transactions, average processing time, and throughput.',
    position: 'bottom',
  },
  {
    id: 'controls',
    target: '[data-tour="controls"]',
    title: 'Pipeline Controls',
    description: 'Use these controls to start/stop the pipeline, adjust processing speed, and add manual transactions. Let me start it for you!',
    position: 'bottom',
    action: 'start-pipeline',
    delay: 1500,
  },
  {
    id: 'pipeline',
    target: '[data-tour="pipeline"]',
    title: 'The Payment Pipeline',
    description: 'Watch transactions flow through 5 stages: Initiation → Fraud Check → Balance Verification → Processing → Settlement. Each colored card is a live transaction!',
    position: 'top',
  },
  {
    id: 'charts',
    target: '[data-tour="charts"]',
    title: 'Live Analytics',
    description: 'Real-time charts showing throughput over time, latency measurements, and fraud detection rates. The data updates as transactions flow through.',
    position: 'top',
  },
  {
    id: 'fraud',
    target: '[data-tour="fraud"]',
    title: 'Fraud Analytics',
    description: 'ML-powered fraud detection visualized. See how risk scores are distributed and watch high-risk transactions get flagged automatically.',
    position: 'top',
  },
  {
    id: 'ai-insights',
    target: '[data-tour="ai-insights"]',
    title: 'AI-Powered Insights',
    description: 'Smart recommendations based on pipeline performance. The AI analyzes patterns and suggests optimizations.',
    position: 'top',
  },
  {
    id: 'geographic',
    target: '[data-tour="geographic"]',
    title: 'Geographic Distribution',
    description: 'See where transactions are coming from around the world. Each region shows active transaction counts.',
    position: 'top',
  },
  {
    id: 'milestones',
    target: '[data-tour="milestones"]',
    title: 'Gamified Milestones',
    description: 'Unlock achievements as you process more transactions! Track your progress toward goals like high throughput and reliability.',
    position: 'top',
  },
  {
    id: 'logs',
    target: '[data-tour="logs"]',
    title: 'System Logs',
    description: 'Developer-friendly terminal logs showing every pipeline event. Great for debugging and monitoring.',
    position: 'top',
  },
  {
    id: 'transactions',
    target: '[data-tour="transactions"]',
    title: 'Transaction List',
    description: 'Detailed view of all transactions with filtering. Click any transaction to see its full journey through the pipeline.',
    position: 'top',
  },
  {
    id: 'complete',
    target: '[data-tour="hero"]',
    title: 'You\'re All Set! 🎉',
    description: 'You now understand how payment pipelines work! Press Space to pause/resume, use 1-3 for speed control. Explore and have fun!',
    position: 'bottom',
  },
];

export function DemoMode() {
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const { state, toggleRunning } = usePipeline();

  const step = tourSteps[currentStep];

  const updateTargetRect = useCallback(() => {
    if (!isActive || !step) return;
    
    const element = document.querySelector(step.target);
    if (element) {
      // Scroll element into view first
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      
      // Wait for scroll to complete then update rect
      setTimeout(() => {
        const rect = element.getBoundingClientRect();
        setTargetRect(rect);
      }, 500);
    }
  }, [isActive, step]);

  useEffect(() => {
    if (!isActive) return;
    
    updateTargetRect();
    
    // Also update rect on scroll (for when user scrolls manually)
    const handleScroll = () => {
      if (!step) return;
      const element = document.querySelector(step.target);
      if (element) {
        const rect = element.getBoundingClientRect();
        setTargetRect(rect);
      }
    };
    
    window.addEventListener('resize', handleScroll);
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('resize', handleScroll);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isActive, currentStep, updateTargetRect, step]);

  // Handle step actions
  useEffect(() => {
    if (!isActive || !step) return;

    const timer = setTimeout(() => {
      if (step.action === 'start-pipeline' && !state.isRunning) {
        toggleRunning();
      }
    }, step.delay || 1000);

    return () => clearTimeout(timer);
  }, [isActive, currentStep, step, state.isRunning, toggleRunning]);

  const startDemo = () => {
    setCurrentStep(0);
    setIsActive(true);
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const endDemo = () => {
    setIsActive(false);
    setCurrentStep(0);
    setTargetRect(null);
  };

  const nextStep = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      endDemo();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  // Auto-advance after delay
  useEffect(() => {
    if (!isActive) return;
    
    const autoAdvance = setTimeout(() => {
      // Don't auto-advance, let user control
    }, 5000);

    return () => clearTimeout(autoAdvance);
  }, [isActive, currentStep]);

  const getTooltipPosition = (): React.CSSProperties => {
    if (!targetRect) return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };

    const padding = 20;
    const tooltipWidth = 350;
    const tooltipHeight = 200;
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;

    let top: number;
    let left: number;

    // Calculate left position (centered on target)
    left = targetRect.left + targetRect.width / 2 - tooltipWidth / 2;
    
    // Keep tooltip within horizontal bounds
    if (left < padding) left = padding;
    if (left + tooltipWidth > viewportWidth - padding) {
      left = viewportWidth - tooltipWidth - padding;
    }

    // Calculate vertical position based on available space
    const spaceAbove = targetRect.top;
    const spaceBelow = viewportHeight - targetRect.bottom;

    if (step?.position === 'top' && spaceAbove > tooltipHeight + padding) {
      // Position above
      top = targetRect.top - tooltipHeight - padding;
    } else if (step?.position === 'bottom' && spaceBelow > tooltipHeight + padding) {
      // Position below
      top = targetRect.bottom + padding;
    } else if (spaceBelow > spaceAbove) {
      // More space below, position there
      top = targetRect.bottom + padding;
      // If still not enough space, position at bottom of viewport
      if (top + tooltipHeight > viewportHeight - padding) {
        top = viewportHeight - tooltipHeight - padding;
      }
    } else {
      // More space above, position there
      top = targetRect.top - tooltipHeight - padding;
      // If still not enough space, position at top of viewport
      if (top < padding) {
        top = padding;
      }
    }

    return {
      position: 'fixed',
      top: `${top}px`,
      left: `${left}px`,
    };
  };

  return (
    <>
      {/* Demo Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={startDemo}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium hover:from-purple-600 hover:to-pink-600 transition-all text-sm shadow-lg shadow-purple-500/25"
      >
        <Sparkles className="w-4 h-4" />
        Demo
      </motion.button>

      {/* Tour Overlay */}
      <AnimatePresence>
        {isActive && (
          <>
            {/* Dark overlay with spotlight cutout */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[200] pointer-events-none"
              style={{
                background: targetRect
                  ? `radial-gradient(ellipse ${targetRect.width + 40}px ${targetRect.height + 40}px at ${targetRect.left + targetRect.width / 2}px ${targetRect.top + targetRect.height / 2}px, transparent 0%, rgba(0,0,0,0.85) 100%)`
                  : 'rgba(0,0,0,0.85)',
              }}
            />

            {/* Highlight border around target */}
            {targetRect && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="fixed z-[201] pointer-events-none rounded-xl"
                style={{
                  top: targetRect.top - 8,
                  left: targetRect.left - 8,
                  width: targetRect.width + 16,
                  height: targetRect.height + 16,
                  border: '2px solid rgba(168, 85, 247, 0.8)',
                  boxShadow: '0 0 20px rgba(168, 85, 247, 0.5), inset 0 0 20px rgba(168, 85, 247, 0.1)',
                }}
              />
            )}

            {/* Pulsing indicator */}
            {targetRect && (
              <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="fixed z-[201] pointer-events-none rounded-xl"
                style={{
                  top: targetRect.top - 8,
                  left: targetRect.left - 8,
                  width: targetRect.width + 16,
                  height: targetRect.height + 16,
                  border: '2px solid rgba(168, 85, 247, 0.4)',
                }}
              />
            )}

            {/* Tooltip */}
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="fixed z-[202] w-[350px] bg-gray-900 rounded-2xl border border-purple-500/50 shadow-2xl shadow-purple-500/20 overflow-hidden"
              style={getTooltipPosition()}
            >
              {/* Progress bar */}
              <div className="h-1 bg-gray-800">
                <motion.div
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentStep + 1) / tourSteps.length) * 100}%` }}
                />
              </div>

              <div className="p-4">
                {/* Step counter */}
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-purple-400 font-medium">
                    Step {currentStep + 1} of {tourSteps.length}
                  </span>
                  <button
                    onClick={endDemo}
                    className="p-1 hover:bg-gray-800 rounded transition-colors"
                  >
                    <X className="w-4 h-4 text-gray-400" />
                  </button>
                </div>

                {/* Content */}
                <h3 className="text-lg font-bold text-white mb-2">{step?.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{step?.description}</p>

                {/* Navigation */}
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-800">
                  <button
                    onClick={prevStep}
                    disabled={currentStep === 0}
                    className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Back
                  </button>

                  <div className="flex gap-1">
                    {tourSteps.map((_, i) => (
                      <div
                        key={i}
                        className={`w-1.5 h-1.5 rounded-full transition-colors ${
                          i === currentStep ? 'bg-purple-500' : 
                          i < currentStep ? 'bg-purple-500/50' : 'bg-gray-700'
                        }`}
                      />
                    ))}
                  </div>

                  <button
                    onClick={nextStep}
                    className="flex items-center gap-1 px-4 py-1.5 bg-purple-500 hover:bg-purple-600 rounded-lg text-sm font-medium transition-colors"
                  >
                    {currentStep === tourSteps.length - 1 ? 'Finish' : 'Next'}
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Skip button */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={endDemo}
              className="fixed bottom-6 right-6 z-[202] px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm text-gray-400 hover:text-white transition-colors"
            >
              Skip Tour (Esc)
            </motion.button>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
