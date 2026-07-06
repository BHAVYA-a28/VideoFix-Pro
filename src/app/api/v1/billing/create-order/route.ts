import { NextResponse } from 'next/server';

export async function POST() {
  const orderId = `order_sim_${Date.now()}`;
  return NextResponse.json({
    order_id: orderId,
    status: 'created'
  });
}
