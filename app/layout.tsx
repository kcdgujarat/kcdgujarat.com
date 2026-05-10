import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import { Header } from '@/components/site/Header';
import { Footer } from '@/components/site/Footer';
import { getSettings } from '@/lib/payload';
import { buildMetadata } from '@/lib/seo';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });

export const metadata: Metadata = buildMetadata({});

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = (await getSettings()) as any;
  return (
    <html lang="en" className={inter.variable} style={{ colorScheme: 'light' }}>
      <body className="bg-white text-kcd-ink antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-kcd-primary focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to main content
        </a>
        <Header
          registrationUrl={settings?.registrationUrl || process.env.NEXT_PUBLIC_REGISTRATION_URL}
          comingSoon={process.env.NEXT_PUBLIC_COMING_SOON === 'true'}
        />
        <main id="main">{children}</main>
        <Footer
          socials={settings?.socialLinks || {}}
          contactEmail={settings?.contactEmail}
        />
        <Analytics />
      </body>
    </html>
  );
}
