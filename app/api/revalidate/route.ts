import { revalidatePath } from 'next/cache';
import type { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const secret = searchParams.get('secret');
  const expected = process.env.REVALIDATE_SECRET;
  if (!expected || secret !== expected) {
    return Response.json({ ok: false, error: 'invalid secret' }, { status: 401 });
  }
  const path = searchParams.get('path') || '/';
  revalidatePath(path);
  return Response.json({ ok: true, revalidated: path });
}
