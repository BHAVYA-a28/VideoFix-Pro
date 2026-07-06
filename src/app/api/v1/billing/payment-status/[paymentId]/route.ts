import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { paymentId: string } }
) {
  return NextResponse.json({
    status: 'captured',
    paymentId: params.paymentId,
    amount: 299900,
    currency: 'INR'
  });
}
