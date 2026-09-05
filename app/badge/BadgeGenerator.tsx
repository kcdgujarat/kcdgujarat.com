'use client';

import * as React from 'react';
import { Container } from '@/components/site/Container';
import { SectionHeader } from '@/components/site/SectionHeader';
import { Button } from '@/components/ui/button';
import { Download, Upload, X } from 'lucide-react';

// ─── Canvas dimensions ────────────────────────────────────────────────────────
// Using full resolution of the provided images for the best download quality
const PLAIN_SIZE = 1280;   // square template (1280×1280)
const PHOTO_W    = 2560;   // landscape "with photo" canvas — 2:1 (2560×1280)
const PHOTO_H    = 1280;   //

export function BadgeGenerator() {
  const canvasRef    = React.useRef<HTMLCanvasElement>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const [photoSrc,   setPhotoSrc]   = React.useState<string | null>(null);
  const [rendering,  setRendering]  = React.useState(false);
  const [downloaded, setDownloaded] = React.useState<'plain' | 'photo' | null>(null);

  // ── Draw "with photo" landscape badge ────────────────────────────────────
  const drawBadge = React.useCallback(async (photo: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setRendering(true);

    // Set actual pixel dimensions to full resolution
    canvas.width  = PHOTO_W;
    canvas.height = PHOTO_H;

    try {
      // ── Load images ─────────────────────────────────────────────────────
      const [templateImg, photoImg] = await Promise.all([
        loadImage('/images/EventBadgeEmpty.png'),
        loadImage(photo),
      ]);

      // ── Draw the full landscape background ─────────────────────────────
      // EventBadgeEmpty is already 2560x1280 with the left/right theme!
      ctx.drawImage(templateImg, 0, 0, PHOTO_W, PHOTO_H);

      // ── Photo circle — centred in the left half, balanced spacing ─────
      const CX = PHOTO_W / 4;   // 640 — horizontal centre of left half
      const CY = 600;           // Lowered slightly to balance the top/bottom gap
      const R  = 420;           // Increased radius to fill the space better without overlapping

      // White ring backdrop
      ctx.save();
      ctx.beginPath();
      ctx.arc(CX, CY, R + 16, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,255,255,1)';
      ctx.fill();
      ctx.restore();

      // Clip + cover-fit the user photo
      const { naturalWidth: iw, naturalHeight: ih } = photoImg;
      const fitScale = (R * 2) / Math.min(iw, ih);
      const dw = iw * fitScale;
      const dh = ih * fitScale;

      ctx.save();
      ctx.beginPath();
      ctx.arc(CX, CY, R, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(photoImg, CX - dw / 2, CY - dh / 2, dw, dh);
      ctx.restore();

      // Blue ring around photo
      ctx.beginPath();
      ctx.arc(CX, CY, R + 8, 0, Math.PI * 2);
      ctx.strokeStyle = '#4285F4';
      ctx.lineWidth   = 12;
      ctx.stroke();
    } catch (err) {
      console.error('Failed to render badge:', err);
    } finally {
      setRendering(false);
    }
  }, []);

  React.useEffect(() => {
    if (photoSrc) drawBadge(photoSrc);
  }, [drawBadge, photoSrc]);

  // ── File upload ───────────────────────────────────────────────────────────
  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setPhotoSrc(ev.target?.result as string);
    reader.readAsDataURL(file);
  }

  // ── Download plain ────────────────────────────────────────────────────────
  async function handleDownloadPlain() {
    try {
      const res = await fetch('/images/EventBadgeNoImage.png');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.download = 'KCD-Gujarat-2026-Im-Attending.png';
      a.href     = url;
      a.click();
      URL.revokeObjectURL(url);
      setDownloaded('plain');
      setTimeout(() => setDownloaded(null), 2000);
    } catch (e) {
      console.error('Failed to download plain image:', e);
    }
  }

  // ── Download with-photo ───────────────────────────────────────────────────
  function handleDownloadPhoto() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.download = 'KCD-Gujarat-2026-Im-Attending-Photo.png';
      a.href     = url;
      a.click();
      URL.revokeObjectURL(url);
      setDownloaded('photo');
      setTimeout(() => setDownloaded(null), 2000);
    }, 'image/png', 1.0);
  }

  return (
    <Container className="py-16">
      <SectionHeader
        eyebrow="Badge"
        title="I'm Attending!"
        description="Generate your personalised social media badge for KCD Gujarat 2026 and share it with the community."
      />

      {/* ── Badges + controls ──────────────────────────────────────────────── */}
      <div className="space-y-12">

        {/* ── 1. Without photo (centered) ──────────────────────────────────── */}
        <section className="flex flex-col items-center gap-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-kcd-muted">
            Without photo
          </p>
          <div className="overflow-hidden rounded-2xl border border-kcd-border shadow-card w-full max-w-[420px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/EventBadgeNoImage.png"
              alt="KCD Gujarat 2026 I'm Attending badge"
              width={PLAIN_SIZE}
              height={PLAIN_SIZE}
              className="w-full h-auto block"
            />
          </div>
          <Button
            id="badge-download-plain"
            variant="outline"
            size="md"
            onClick={handleDownloadPlain}
            className="rounded-full px-8"
          >
            <Download className="h-4 w-4" />
            {downloaded === 'plain' ? 'Saved!' : 'Download'}
          </Button>
        </section>

        {/* ── 2. With photo (landscape: photo left | template right) ─────────── */}
        <section className="flex flex-col items-center gap-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-kcd-muted">
            With your photo
          </p>

          {/* Photo upload card */}
          <div className="w-full max-w-md rounded-2xl border border-kcd-border bg-white p-5 shadow-card">
            {photoSrc ? (
              <div className="flex items-center gap-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photoSrc}
                  alt="Your photo"
                  className="h-12 w-12 rounded-full object-cover ring-2 ring-kcd-primary/30"
                />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-kcd-ink">Photo added ✓</p>
                  <p className="text-xs text-kcd-muted">Visible in the badge below</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setPhotoSrc(null);
                    if (fileInputRef.current) fileInputRef.current.value = '';
                  }}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-kcd-border bg-white text-kcd-muted transition hover:border-red-300 hover:text-red-500"
                  aria-label="Remove photo"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <button
                id="badge-photo-upload"
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex w-full flex-col items-center gap-2 rounded-xl border-2 border-dashed border-kcd-border py-6 text-center transition hover:border-kcd-primary/50 hover:bg-kcd-subtle"
              >
                <Upload className="h-5 w-5 text-kcd-muted" />
                <span className="text-sm font-semibold text-kcd-ink">Click to upload photo</span>
                <span className="text-xs text-kcd-muted">JPG, PNG, WEBP · stays on your device</span>
              </button>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
              aria-label="Upload your photo for the badge"
            />
          </div>

          {/* Badge preview: photo LEFT | template RIGHT */}
          <div className="relative overflow-hidden rounded-2xl border border-kcd-border shadow-card w-full max-w-[840px]">
            {!photoSrc && (
              <div className="relative w-full">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src="/images/EventBadgewithPlaceholder.png" 
                  alt="Badge placeholder" 
                  className="w-full h-auto block" 
                />
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 bg-kcd-bg/60 backdrop-blur-[1px]">
                  <Upload className="h-7 w-7 text-kcd-ink" />
                  <p className="text-center text-xs font-semibold text-kcd-ink px-8">
                    Upload a photo to preview this version
                  </p>
                </div>
              </div>
            )}
            <canvas
              ref={canvasRef}
              id="badge-canvas"
              className={photoSrc ? "w-full h-auto block" : "hidden"}
            />
          </div>

          <Button
            id="badge-download-photo"
            variant="primary"
            size="md"
            disabled={!photoSrc || rendering}
            onClick={handleDownloadPhoto}
            className="rounded-full px-8"
          >
            <Download className="h-4 w-4" />
            {downloaded === 'photo' ? 'Saved!' : 'Download'}
          </Button>
        </section>

        {/* ── Hashtags + share note ─────────────────────────────────────────── */}
        <section className="flex flex-col items-center gap-4">
          <div className="flex flex-wrap justify-center gap-2">
            {['#KCDGujarat', '#CloudNative', '#Kubernetes', '#CNCF'].map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-kcd-border bg-white px-3 py-1 text-xs font-semibold text-kcd-ink shadow-card"
              >
                {tag}
              </span>
            ))}
          </div>
          <div className="rounded-2xl border border-kcd-border bg-white px-8 py-6 text-center shadow-card">
            <p className="text-sm font-semibold text-kcd-ink">📣 Spread the Word!</p>
            <p className="mx-auto mt-2 max-w-sm text-sm text-kcd-muted">
              Tag{' '}
              <a
                href="https://twitter.com/KCDGujarat"
                className="font-semibold text-kcd-primary"
                target="_blank"
                rel="noopener noreferrer"
              >
                @KCDGujarat
              </a>{' '}
              and use <span className="font-semibold text-kcd-ink">#KCDGujarat2026</span> when you share.
            </p>
          </div>
        </section>

      </div>
    </Container>
  );
}

// ─── Helper ───────────────────────────────────────────────────────────────────
function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    // Do not set crossOrigin for data URIs to avoid CORS errors in WebKit browsers
    if (!src.startsWith('data:')) {
      img.crossOrigin = 'anonymous';
    }
    img.onload  = () => resolve(img);
    img.onerror = reject;
    img.src     = src;
  });
}
