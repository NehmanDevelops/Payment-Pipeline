export type TransactionStatus = 
  | 'initiated'
  | 'fraud_check'
  | 'balance_verify'
  | 'processing'
  | 'settlement'
  | 'completed'
  | 'failed'
  | 'retry_queue';

export type TransactionType = 'transfer' | 'payment' | 'deposit' | 'withdrawal';

export interface Transaction {
  id: string;
  amount: number;
  currency: string;
  sender: string;
  recipient: string;
  type: TransactionType;
  status: TransactionStatus;
  fraudScore: number;
  timestamp: Date;
  stages: StageLog[];
  metadata?: Record<string, unknown>;
}

export interface StageLog {
  stage: TransactionStatus;
  enteredAt: Date;
  exitedAt?: Date;
  latency?: number;
  success: boolean;
  message?: string;
}

export interface PipelineStage {
  id: TransactionStatus;
  name: string;
  description: string;
  icon: string;
  avgLatency: number;
  successRate: number;
  activeTransactions: number;
}

export interface PipelineMetrics {
  totalTransactions: number;
  successfulTransactions: number;
  failedTransactions: number;
  avgProcessingTime: number;
  throughput: number;
  stages: PipelineStage[];
}
