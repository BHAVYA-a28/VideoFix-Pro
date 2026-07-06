import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  return NextResponse.json({
    userId: params.userId,
    historicalTelemetery: [
      { timestamp: '2024-03-10', ram_detect: '16GB', stable: true },
      { timestamp: '2024-03-15', ram_detect: '32GB', upgrade_detect: 'Successful' }
    ]
  });
}
