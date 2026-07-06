import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId } = await params;
  return NextResponse.json({
    userId,
    active_subscription: 'Pro Professional',
    expiry: '2025-03-31'
  });
}
