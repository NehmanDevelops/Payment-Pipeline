import { NextResponse } from 'next/server';

export async function GET() {
  // Simulated metrics endpoint
  const metrics = {
    timestamp: new Date().toISOString(),
    pipeline: {
      status: 'healthy',
      uptime: '99.9%',
      version: '1.0.0',
    },
    stages: {
      initiated: { avgLatency: 100, successRate: 100 },
      fraud_check: { avgLatency: 500, successRate: 92 },
      balance_verify: { avgLatency: 250, successRate: 95 },
      processing: { avgLatency: 650, successRate: 98 },
      settlement: { avgLatency: 1250, successRate: 99 },
    },
  };
  
  return NextResponse.json(metrics);
}
