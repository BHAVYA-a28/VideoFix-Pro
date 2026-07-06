import { NextResponse } from 'next/server';
import { SOFTWARE_CATALOG } from '../route';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const software = SOFTWARE_CATALOG.find(s => s.id === params.id);
  if (!software) {
    return NextResponse.json({ error: 'Software definition not found' }, { status: 404 });
  }
  return NextResponse.json(software);
}
