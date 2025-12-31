import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency: string = 'CAD'): string {
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency,
  }).format(amount);
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-CA', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(date);
}

export function formatLatency(ms: number): string {
  if (ms < 1000) {
    return `${ms}ms`;
  }
  return `${(ms / 1000).toFixed(2)}s`;
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    initiated: 'text-blue-400',
    fraud_check: 'text-orange-400',
    balance_verify: 'text-purple-400',
    processing: 'text-cyan-400',
    settlement: 'text-yellow-400',
    completed: 'text-green-400',
    failed: 'text-red-400',
    retry_queue: 'text-amber-400',
  };
  return colors[status] || 'text-gray-400';
}

export function getRiskLevel(score: number): { level: string; color: string } {
  if (score <= 25) {
    return { level: 'Low', color: 'text-green-400' };
  }
  if (score <= 50) {
    return { level: 'Medium', color: 'text-yellow-400' };
  }
  if (score <= 75) {
    return { level: 'High', color: 'text-orange-400' };
  }
  return { level: 'Critical', color: 'text-red-400' };
}

export function truncateId(id: string, length: number = 12): string {
  if (id.length <= length) return id;
  return `${id.slice(0, length)}...`;
}

export function calculateSuccessRate(successful: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((successful / total) * 100);
}
