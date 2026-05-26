import { Container } from '@/components/site/Container';
import { SectionHeader } from '@/components/site/SectionHeader';
import { ButtonLink } from '@/components/ui/button';
import { getRegistrationConfig } from '@/lib/content';
import { buildMetadata } from '@/lib/seo';

export const revalidate = 3600;
export const metadata = buildMetadata({
  title: 'Register',
  path: '/register',
  description: 'Register to attend KCD Gujarat 2026.',
});

export default async function RegisterPage() {
  const registration = await getRegistrationConfig();

  if (!registration.open) {
    return (
      <Container className="py-16">
        <SectionHeader
          eyebrow="Register"
          title="Registration opens soon"
          description="We're getting everything ready. Drop by again shortly — tickets will be available here once registration opens."
        />
        <div className="rounded-2xl border border-kcd-border bg-white p-8 shadow-card text-center">
          <p className="text-kcd-muted">
            In the meantime, follow us on social media or sign up for updates so you don't miss the announcement.
          </p>
        </div>
      </Container>
    );
  }

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
          <ButtonLink href={registration.url || '#'} size="lg">
            Go to ticketing
          </ButtonLink>
        </div>
      </div>
    </Container>
  );
}
