import { NextResponse } from 'next/server';
import { SOFTWARE_CATALOG } from '../route';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const software = SOFTWARE_CATALOG.find(s => s.id === id);
  if (!software) {
    return NextResponse.json({ error: 'Software definition not found' }, { status: 404 });
  }
  return NextResponse.json(software);
}
