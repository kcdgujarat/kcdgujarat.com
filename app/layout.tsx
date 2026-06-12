import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { Plus_Jakarta_Sans, Inter, Noto_Sans_Gujarati } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import { Header } from '@/components/site/Header';
import { Footer } from '@/components/site/Footer';
import { getCfpConfig, getRegistrationConfig, getEventConfig, getSocialLinks } from '@/lib/content';
import { buildMetadata } from '@/lib/seo';
import './globals.css';

// Brand guideline: Plus Jakarta Sans for display headings (700–800)
const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  weight: ['600', '700', '800'],
});

// Brand guideline: Inter for body copy & UI (400–500)
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
  weight: ['400', '500', '600'],
});

// Brand guideline: Noto Sans Gujarati (Bold/Black) for Gujarati script
const notoSansGujarati = Noto_Sans_Gujarati({
  subsets: ['gujarati'],
  variable: '--font-gujarati',
  display: 'swap',
  weight: ['700', '900'],
});

export const metadata: Metadata = buildMetadata({});

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [event, cfp, registration, socialLinks] = await Promise.all([
    getEventConfig(),
    getCfpConfig(),
    getRegistrationConfig(),
    getSocialLinks(),
  ]);
  const comingSoon = process.env.NEXT_PUBLIC_COMING_SOON === 'true';
  const cfpOpen = cfp.open;
  const showSpeakers = cfp.showSpeakers;
  const showTeam = event.showTeam;
  const registrationOpen = registration.open;
  const pathname = (await headers()).get('x-pathname') ?? '/';
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${plusJakartaSans.variable} ${inter.variable} ${notoSansGujarati.variable}`}
      style={{ colorScheme: 'light' }}
    >
      <body className="bg-kcd-bg text-kcd-ink antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-kcd-primary focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to main content
        </a>
        <Header
          pathname={pathname}
          registrationOpen={registrationOpen}
          comingSoon={comingSoon}
          cfpOpen={cfpOpen}
          showSpeakers={showSpeakers}
          showTeam={showTeam}
        />
        <main id="main">{children}</main>
        {!comingSoon && (
          <Footer
            socials={socialLinks}
            contactEmail={event.contactEmail}
            cfpOpen={cfpOpen}
            showSpeakers={showSpeakers}
            showTeam={showTeam}
          />
        )}
        <Analytics />
      </body>
    </html>
  );
}
