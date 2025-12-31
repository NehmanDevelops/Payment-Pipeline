// Pipeline Stage Constants
export const PIPELINE_STAGES = [
  'initiated',
  'fraud_check',
  'balance_verify',
  'processing',
  'settlement',
  'completed',
] as const;

export const STAGE_NAMES: Record<string, string> = {
  initiated: 'Initiated',
  fraud_check: 'Fraud Check',
  balance_verify: 'Balance Verify',
  processing: 'Processing',
  settlement: 'Settlement',
  completed: 'Completed',
  failed: 'Failed',
  retry_queue: 'Retry Queue',
};

export const STAGE_DESCRIPTIONS: Record<string, string> = {
  initiated: 'Transaction received and queued for processing',
  fraud_check: 'ML-based risk scoring and fraud detection',
  balance_verify: 'Validating account balance and limits',
  processing: 'Executing the transaction',
  settlement: 'Final clearing and settlement',
  completed: 'Transaction completed successfully',
  failed: 'Transaction failed - moved to retry queue',
  retry_queue: 'Awaiting manual review or retry',
};

// Risk Score Thresholds
export const RISK_THRESHOLDS = {
  LOW: 25,
  MEDIUM: 50,
  HIGH: 75,
  CRITICAL: 100,
} as const;

// Latency Ranges (in ms)
export const STAGE_LATENCY_RANGES: Record<string, [number, number]> = {
  initiated: [50, 150],
  fraud_check: [200, 800],
  balance_verify: [100, 400],
  processing: [300, 1000],
  settlement: [500, 2000],
};

// Transaction Types
export const TRANSACTION_TYPES = ['transfer', 'payment', 'deposit', 'withdrawal'] as const;

// Amount Ranges by Transaction Type
export const AMOUNT_RANGES: Record<string, [number, number]> = {
  transfer: [100, 10000],
  payment: [10, 500],
  deposit: [500, 25000],
  withdrawal: [50, 2000],
};

// Failure Rates by Stage
export const STAGE_FAILURE_RATES: Record<string, number> = {
  initiated: 0,
  fraud_check: 0.08, // 8% for high-risk transactions
  balance_verify: 0.08,
  processing: 0.03,
  settlement: 0.02,
};

// UI Configuration
export const UI_CONFIG = {
  MAX_TRANSACTIONS_DISPLAYED: 100,
  CHART_DATA_POINTS: 20,
  AUTO_GENERATE_INTERVAL: 2000, // ms
  ANIMATION_DURATION: 0.3,
} as const;

// Color Scheme
export const STATUS_COLORS: Record<string, { text: string; bg: string }> = {
  initiated: { text: 'text-blue-400', bg: 'bg-blue-500/20' },
  fraud_check: { text: 'text-orange-400', bg: 'bg-orange-500/20' },
  balance_verify: { text: 'text-purple-400', bg: 'bg-purple-500/20' },
  processing: { text: 'text-cyan-400', bg: 'bg-cyan-500/20' },
  settlement: { text: 'text-yellow-400', bg: 'bg-yellow-500/20' },
  completed: { text: 'text-green-400', bg: 'bg-green-500/20' },
  failed: { text: 'text-red-400', bg: 'bg-red-500/20' },
  retry_queue: { text: 'text-amber-400', bg: 'bg-amber-500/20' },
};
