import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, hardwareProfile } = body;
    
    console.log(`[Telemetry Ingest] User ${userId || 'Guest'} - ${hardwareProfile?.os} - RAM: ${hardwareProfile?.totalMemory}`);
    
    return NextResponse.json({
      ingested: true,
      timestamp: new Date().toISOString(),
      session_id: Date.now()
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
