import { NextResponse } from 'next/server';
import { SOFTWARE_CATALOG } from '../route';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { softwareId, systemSpec } = body;
    const software = SOFTWARE_CATALOG.find(s => s.id === softwareId);
    
    if (!software) {
      return NextResponse.json({ error: 'Target software missing' }, { status: 404 });
    }

    const isCompatible = systemSpec.ram >= 8 && systemSpec.cores >= 4;
    
    return NextResponse.json({
      compatible: isCompatible,
      software: software.name,
      vfp_certified: true,
      recommendation: isCompatible ? 'Ready for High-Performance Export' : 'Upgrade RAM Suggested'
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Invalid request' }, { status: 400 });
  }
}
