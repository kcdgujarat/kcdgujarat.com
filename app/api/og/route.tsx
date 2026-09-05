import { ImageResponse } from 'next/og';
import type { NextRequest } from 'next/server';
import { EVENT_NAME } from '@/lib/brand';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get('title') || EVENT_NAME;
  const subtitle =
    searchParams.get('subtitle') || 'A CNCF-backed community conference in Gujarat, India';

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '64px',
          background:
            'linear-gradient(135deg, #ffffff 0%, #f1f5f9 50%, #ffffff 100%)',
          color: '#0f172a',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 999,
              background: '#1a73e8',
            }}
          />
          <span style={{ fontSize: 24, fontWeight: 600 }}>{EVENT_NAME}</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <span style={{ fontSize: 64, fontWeight: 800, lineHeight: 1.1 }}>{title}</span>
          <span style={{ fontSize: 28, color: '#64748b' }}>{subtitle}</span>
        </div>
        <div style={{ display: 'flex', gap: 12, fontSize: 20, color: '#64748b' }}>
          <span>kcdgujarat.com</span>
          <span>·</span>
          <span>A CNCF-backed community conference</span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      headers: {
        'Cache-Control': 'public, max-age=86400, s-maxage=86400',
      },
    },
  );
}
