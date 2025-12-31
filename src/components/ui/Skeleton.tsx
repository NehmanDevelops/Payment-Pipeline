'use client';

import { motion } from 'framer-motion';

export function Skeleton({ className = '' }: { className?: string }) {
  return (
    <motion.div
      className={`bg-gray-800 rounded ${className}`}
      animate={{ opacity: [0.5, 0.8, 0.5] }}
      transition={{ duration: 1.5, repeat: Infinity }}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="bg-gray-900/50 rounded-2xl border border-gray-800 p-6">
      <Skeleton className="h-6 w-32 mb-4" />
      <Skeleton className="h-12 w-full mb-2" />
      <Skeleton className="h-4 w-24" />
    </div>
  );
}

export function MetricsSkeleton() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
      {[...Array(5)].map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}

export function PipelineSkeleton() {
  return (
    <div className="bg-gray-900/50 rounded-2xl border border-gray-800 p-6">
      <Skeleton className="h-6 w-40 mb-6" />
      <div className="flex items-center justify-between gap-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex-1">
            <Skeleton className="h-24 w-full rounded-xl" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function TransactionSkeleton() {
  return (
    <div className="space-y-3">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="bg-gray-800/50 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <Skeleton className="w-10 h-10 rounded-lg" />
            <div className="flex-1">
              <Skeleton className="h-4 w-48 mb-2" />
              <Skeleton className="h-3 w-32" />
            </div>
            <Skeleton className="h-6 w-20" />
          </div>
        </div>
      ))}
    </div>
  );
}
