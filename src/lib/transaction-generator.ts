import { Transaction, TransactionType, TransactionStatus, StageLog } from '@/types';

const firstNames = ['James', 'Sarah', 'Michael', 'Emma', 'David', 'Olivia', 'John', 'Sophia', 'Robert', 'Ava'];
const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];
const companies = ['TechCorp', 'GlobalBank', 'RetailMax', 'FoodMart', 'AutoDrive', 'HealthPlus', 'EduLearn', 'TravelNow'];

function randomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateId(): string {
  return `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
}

function generateName(): string {
  return `${randomElement(firstNames)} ${randomElement(lastNames)}`;
}

function generateRecipient(type: TransactionType): string {
  if (type === 'payment') {
    return randomElement(companies);
  }
  return generateName();
}

export function generateTransaction(): Transaction {
  const types: TransactionType[] = ['transfer', 'payment', 'deposit', 'withdrawal'];
  const type = randomElement(types);
  
  const amountRanges: Record<TransactionType, [number, number]> = {
    transfer: [100, 10000],
    payment: [10, 500],
    deposit: [500, 25000],
    withdrawal: [50, 2000],
  };
  
  const [min, max] = amountRanges[type];
  const amount = Math.round((Math.random() * (max - min) + min) * 100) / 100;
  
  // Higher amounts have slightly higher fraud scores
  const baseFraudScore = Math.random() * 30;
  const amountFactor = (amount / max) * 20;
  const fraudScore = Math.min(Math.round(baseFraudScore + amountFactor), 100);
  
  const initialStage: StageLog = {
    stage: 'initiated',
    enteredAt: new Date(),
    success: true,
    message: 'Transaction initiated successfully',
  };

  return {
    id: generateId(),
    amount,
    currency: 'CAD',
    sender: generateName(),
    recipient: generateRecipient(type),
    type,
    status: 'initiated',
    fraudScore,
    timestamp: new Date(),
    stages: [initialStage],
  };
}

export function getNextStage(currentStatus: TransactionStatus): TransactionStatus | null {
  const stageOrder: TransactionStatus[] = [
    'initiated',
    'fraud_check',
    'balance_verify',
    'processing',
    'settlement',
    'completed',
  ];
  
  const currentIndex = stageOrder.indexOf(currentStatus);
  if (currentIndex === -1 || currentIndex === stageOrder.length - 1) {
    return null;
  }
  
  return stageOrder[currentIndex + 1];
}

export function shouldFailTransaction(transaction: Transaction, stage: TransactionStatus): boolean {
  // Fraud check failures based on fraud score
  if (stage === 'fraud_check') {
    return transaction.fraudScore > 75;
  }
  
  // Random failures at other stages (5% chance)
  if (stage === 'balance_verify') {
    return Math.random() < 0.08;
  }
  
  if (stage === 'processing') {
    return Math.random() < 0.03;
  }
  
  if (stage === 'settlement') {
    return Math.random() < 0.02;
  }
  
  return false;
}

export function getStageLatency(stage: TransactionStatus): number {
  const latencies: Record<TransactionStatus, [number, number]> = {
    initiated: [50, 150],
    fraud_check: [200, 800],
    balance_verify: [100, 400],
    processing: [300, 1000],
    settlement: [500, 2000],
    completed: [0, 0],
    failed: [0, 0],
    retry_queue: [0, 0],
  };
  
  const [min, max] = latencies[stage];
  return Math.round(Math.random() * (max - min) + min);
}

export function getFailureMessage(stage: TransactionStatus, transaction: Transaction): string {
  const messages: Record<TransactionStatus, string[]> = {
    initiated: ['Connection timeout'],
    fraud_check: [
      `High risk score detected (${transaction.fraudScore}/100)`,
      'Suspicious transaction pattern',
      'Flagged by ML model - unusual amount',
    ],
    balance_verify: [
      'Insufficient funds',
      'Account hold detected',
      'Daily limit exceeded',
    ],
    processing: [
      'Processing timeout',
      'Internal service error',
      'Rate limit exceeded',
    ],
    settlement: [
      'Settlement network unavailable',
      'Recipient bank rejected',
      'Clearing house timeout',
    ],
    completed: [],
    failed: [],
    retry_queue: [],
  };
  
  return randomElement(messages[stage] || ['Unknown error']);
}
