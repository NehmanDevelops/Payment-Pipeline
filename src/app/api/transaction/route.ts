import { NextResponse } from 'next/server';
import { generateTransaction } from '@/lib/transaction-generator';

export async function GET() {
  const transaction = generateTransaction();
  return NextResponse.json(transaction);
}

export async function POST(request: Request) {
  const body = await request.json();
  
  // You could add custom transaction creation here
  const transaction = generateTransaction();
  
  return NextResponse.json({
    success: true,
    transaction,
  });
}
