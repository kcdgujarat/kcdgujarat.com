import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx,mdx}',
    './components/**/*.{ts,tsx}',
    './content/**/*.{md,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '1rem',
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1200px',
        '2xl': '1320px',
      },
    },
    extend: {
      colors: {
        kcd: {
          primary: '#4285F4',   // Tech Blue — primary CTAs & highlight text
          green: '#557B3E',     // Heritage Green — secondary text accent
          orange: '#E05F36',    // Terracotta Orange — Gujarati script & accents
          yellow: '#E8B321',    // warm yellow (kept for internal use)
          accent: '#E05F36',    // alias → Terracotta Orange
          ink: '#111827',       // Dark Ink — body text & illustrations on light bg
          navy: '#0F172A',      // Deep Navy — dark section backgrounds
          bg: '#F6F4ED',        // Warm Cream — primary light background
          cream: '#F6F4ED',     // alias → Warm Cream
          surface: '#F0EBE1',   // slightly warmer tint for alternate sections
          muted: '#6B7280',     // muted text
          border: 'rgba(17, 24, 39, 0.12)',
          subtle: '#E8E3D8',    // subtle tint derived from cream
          notice: '#000000',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
        gujarati: ['var(--font-gujarati)', 'var(--font-display)', 'sans-serif'],
      },
      borderRadius: {
        lg: '0.75rem',
        xl: '1rem',
        '2xl': '1.25rem',
        '3xl': '1.75rem',
        pill: '9999px',
      },
      boxShadow: {
        card: '0 1px 2px 0 rgb(0 0 0 / 0.04), 0 1px 3px 0 rgb(0 0 0 / 0.06)',
      },
    },
  },
  plugins: [],
};

export default config;
