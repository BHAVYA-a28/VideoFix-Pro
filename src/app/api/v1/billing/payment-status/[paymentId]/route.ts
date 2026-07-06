import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ paymentId: string }> }
) {
  const { paymentId } = await params;
  return NextResponse.json({
    status: 'captured',
    paymentId,
    amount: 299900,
    currency: 'INR'
  });
}
