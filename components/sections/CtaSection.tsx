import { Container } from '@/components/site/Container';
import { ButtonLink } from '@/components/ui/button';

export function CtaSection({
  registrationUrl,
  cfpUrl,
}: {
  registrationUrl?: string;
  cfpUrl?: string;
}) {
  return (
    <section className="py-20">
      <Container>
        <div className="rounded-3xl border border-kcd-border bg-gradient-to-br from-kcd-primary/5 via-white to-kcd-accent/5 p-10 text-center shadow-card md:p-16">
          <h2 className="font-display text-3xl font-bold text-kcd-ink sm:text-4xl">
            Be part of KCD Gujarat 2026
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-base text-kcd-muted md:text-lg">
            Whether you want to speak, sponsor, or simply attend — we would love to have you.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <ButtonLink href={registrationUrl || '/register'} size="lg">
              Register now
            </ButtonLink>
            <ButtonLink href={cfpUrl || '/cfp'} size="lg" variant="outline">
              Submit a talk
            </ButtonLink>
          </div>
        </div>
      </Container>
    </section>
  );
}
