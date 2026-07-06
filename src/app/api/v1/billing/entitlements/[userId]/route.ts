import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  return NextResponse.json({
    userId: params.userId,
    active_subscription: 'Pro Professional',
    expiry: '2025-03-31'
  });
}
