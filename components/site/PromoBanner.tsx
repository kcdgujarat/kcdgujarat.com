'use client';

import * as React from 'react';
import { Ticket, Copy, Check } from 'lucide-react';

interface PromoBannerProps {
  registrationUrl: string;
}

const PROMO_CODE = 'FLAT25';

export function PromoBanner({ registrationUrl }: PromoBannerProps) {
  const [copied, setCopied] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () =>
      document.documentElement.style.setProperty('--promo-banner-height', `${el.offsetHeight}px`);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  function handleCopy() {
    const write = navigator.clipboard?.writeText(PROMO_CODE);
    if (write) {
      write.then(flash).catch(fallbackCopy);
    } else {
      fallbackCopy();
    }
  }

  function fallbackCopy() {
    const el = document.createElement('textarea');
    el.value = PROMO_CODE;
    el.style.cssText = 'position:fixed;opacity:0;pointer-events:none';
    document.body.appendChild(el);
    el.select();
    try { document.execCommand('copy'); } catch { /* ignore */ }
    document.body.removeChild(el);
    flash();
  }

  function flash() {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div
      ref={ref}
      role="region"
      aria-label="Promotional offer"
      style={{
        background: 'linear-gradient(to right, #4285F4, #3b71d4, #E05F36)',
        position: 'sticky',
        top: 0,
        zIndex: 60,
        width: '100%',
        overflow: 'hidden',
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.12) 50%, transparent 100%)',
          backgroundSize: '200% 100%',
          animation: 'promoBannerShimmer 3s linear infinite',
        }}
      />

      <div
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem 0.75rem',
          flexWrap: 'wrap',
          maxWidth: '80rem',
          margin: '0 auto',
          padding: '0.625rem 1rem',
          textAlign: 'center',
          color: '#ffffff',
          fontSize: '0.875rem',
          fontWeight: 500,
        }}
      >
        <Ticket aria-hidden="true" style={{ width: '1rem', height: '1rem', opacity: 0.9, flexShrink: 0 }} />
        <span style={{ opacity: 0.95 }}>Save 25% on conference tickets — use code</span>

        <button
          type="button"
          onClick={handleCopy}
          aria-label={copied ? 'Code copied!' : `Copy discount code ${PROMO_CODE}`}
          title={copied ? 'Copied!' : 'Click to copy'}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.375rem',
            borderRadius: '0.375rem',
            border: '1.5px solid rgba(255,255,255,0.5)',
            background: copied ? 'rgba(255,255,255,0.30)' : 'rgba(255,255,255,0.18)',
            padding: '0.125rem 0.625rem',
            fontFamily: 'monospace',
            fontSize: '0.875rem',
            fontWeight: 700,
            letterSpacing: '0.12em',
            color: '#ffffff',
            cursor: 'pointer',
            transition: 'background 0.2s',
            userSelect: 'none',
          }}
        >
          {copied ? 'COPIED!' : PROMO_CODE}
          {copied
            ? <Check style={{ width: '0.8rem', height: '0.8rem' }} />
            : <Copy style={{ width: '0.8rem', height: '0.8rem', opacity: 0.75 }} />
          }
        </button>

        <a
          href={registrationUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            borderRadius: '9999px',
            background: '#ffffff',
            padding: '0.25rem 1rem',
            fontSize: '0.875rem',
            fontWeight: 600,
            color: '#1a56db',
            textDecoration: 'none',
            boxShadow: '0 1px 4px rgba(0,0,0,0.15)',
            transition: 'opacity 0.15s',
            whiteSpace: 'nowrap',
          }}
          onMouseEnter={e => ((e.currentTarget as HTMLAnchorElement).style.opacity = '0.88')}
          onMouseLeave={e => ((e.currentTarget as HTMLAnchorElement).style.opacity = '1')}
        >
          Get Tickets →
        </a>
      </div>

    </div>
  );
}
