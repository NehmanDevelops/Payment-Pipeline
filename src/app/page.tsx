'use client';

import { PipelineProvider } from '@/context/PipelineContext';
import { 
  PipelineVisualizer, 
  TransactionList, 
  MetricsDashboard, 
  ControlPanel,
  RetryQueue,
  LiveChart,
  FraudAnalytics
} from '@/components';
import { Github, Linkedin, ExternalLink } from 'lucide-react';

function Header() {
  return (
    <header className="border-b border-gray-800 bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
              <span className="text-black font-bold text-xl">₿</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Payment Pipeline</h1>
              <p className="text-xs text-gray-400">Real-time Settlement Visualizer</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <a 
              href="https://github.com/NehmanDevelops/Payment-Pipeline"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-800 text-gray-300 hover:text-white hover:bg-gray-700 transition-colors text-sm"
            >
              <Github className="w-4 h-4" />
              Source
            </a>
            <a 
              href="https://nehmans-portfolio.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30 transition-colors text-sm"
            >
              <ExternalLink className="w-4 h-4" />
              Portfolio
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="border-t border-gray-800 mt-8">
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">
            Built by{' '}
            <a 
              href="https://nehmans-portfolio.vercel.app" 
              className="text-yellow-400 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Nehman
            </a>
            {' '}— Demonstrating enterprise payment infrastructure concepts
          </p>
          <div className="flex items-center gap-4">
            <a 
              href="https://github.com/NehmanDevelops"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <Github className="w-5 h-5" />
            </a>
            <a 
              href="https://linkedin.com/in/nehmankarimi"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <Linkedin className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function Home() {
  return (
    <PipelineProvider>
      <div className="min-h-screen bg-black text-white">
        <Header />
        
        <main className="max-w-7xl mx-auto px-6 py-8 space-y-6">
          {/* Hero Section */}
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
              Payment Settlement Pipeline
            </h2>
            <p className="text-gray-400 mt-2 max-w-2xl mx-auto">
              A real-time visualization of how payments flow through a banking system — from initiation to final settlement.
              Watch transactions move through fraud detection, balance verification, and clearing stages.
            </p>
          </div>

          {/* Metrics */}
          <MetricsDashboard />
          
          {/* Controls */}
          <ControlPanel />
          
          {/* Pipeline Visualization */}
          <PipelineVisualizer />
          
          {/* Analytics Section */}
          <div className="grid md:grid-cols-2 gap-6">
            <LiveChart />
            <FraudAnalytics />
          </div>
          
          {/* Retry Queue */}
          <RetryQueue />
          
          {/* Transaction List */}
          <TransactionList />
          
          {/* Info Section */}
          <div className="grid md:grid-cols-3 gap-6 mt-8">
            <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-6">
              <h3 className="text-lg font-semibold text-white mb-2">🔍 Fraud Detection</h3>
              <p className="text-gray-400 text-sm">
                Each transaction passes through ML-based risk scoring. High-risk transactions (score &gt; 75) 
                are automatically flagged and moved to the retry queue for manual review.
              </p>
            </div>
            <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-6">
              <h3 className="text-lg font-semibold text-white mb-2">⚡ Real-time Processing</h3>
              <p className="text-gray-400 text-sm">
                Watch transactions flow through each stage with realistic latency. Speed up or slow down 
                the simulation to observe different scenarios and failure modes.
              </p>
            </div>
            <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-6">
              <h3 className="text-lg font-semibold text-white mb-2">📊 Audit Trail</h3>
              <p className="text-gray-400 text-sm">
                Click any transaction to expand its complete audit trail. See exactly which stage failed, 
                latency at each step, and detailed error messages.
              </p>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </PipelineProvider>
  );
}
