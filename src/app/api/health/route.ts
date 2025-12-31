import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    services: {
      pipeline: 'healthy',
      database: 'simulated',
      cache: 'simulated',
    },
  });
}
