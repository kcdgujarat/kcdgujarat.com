import { Container } from '@/components/site/Container';
import { SectionHeader } from '@/components/site/SectionHeader';
import { ButtonLink } from '@/components/ui/button';
import { getSettings } from '@/lib/payload';
import { buildMetadata } from '@/lib/seo';

export const revalidate = 3600;
export const metadata = buildMetadata({
  title: 'Register',
  path: '/register',
  description: 'Register to attend KCD Gujarat 2026.',
});

export default async function RegisterPage() {
  const settings = (await getSettings()) as any;
  const url = settings?.registrationUrl || process.env.NEXT_PUBLIC_REGISTRATION_URL;
  return (
    <Container className="py-16">
      <SectionHeader
        eyebrow="Register"
        title="Reserve your seat"
        description="Tickets are issued via our ticketing partner. Click below to continue."
      />
      <div className="rounded-2xl border border-kcd-border bg-white p-8 shadow-card">
        <p className="text-kcd-muted">
          We keep ticketing on a dedicated platform so you have a clean checkout experience. You will be redirected to the ticketing partner.
        </p>
        <div className="mt-6">
          <ButtonLink href={url || '#'} size="lg">
            Go to ticketing
          </ButtonLink>
        </div>
      </div>
    </Container>
  );
}
