import { Container } from '@/components/site/Container';
import { ButtonLink } from '@/components/ui/button';

interface Props {
  registrationUrl?: string;
  soldOut?: boolean;
}

export function CtaSection({ registrationUrl, soldOut = false }: Props) {
  return (
    <section className="py-20">
      <Container>
        <div className="relative overflow-hidden rounded-3xl bg-kcd-navy p-10 text-center text-white shadow-card md:p-16">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full opacity-30 blur-3xl"
            style={{
              background:
                'linear-gradient(120deg, #2D6BF0 0%, #5E8E1A 50%, #D9531E 100%)',
            }}
          />
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/70">
            Ready to join us?
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl md:text-5xl">
            Be part of the premier Kubernetes event in Gujarat.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-white/75 md:text-lg">
            Register now and join the growing cloud-native community in western India. Talks, workshops, and a full day of meaningful connections.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            {soldOut ? (
              <span className="inline-flex h-12 items-center justify-center rounded-full border border-white/30 bg-white/10 px-7 text-sm font-bold uppercase tracking-wider text-white/80">
                🎟️ Sold Out
              </span>
            ) : (
              <ButtonLink href={registrationUrl || '/register'} size="lg" className="rounded-full">
                Book Tickets
              </ButtonLink>
            )}
            <ButtonLink
              href="/cfp"
              size="lg"
              variant="outline"
              className="rounded-full !border-white/40 !bg-transparent !text-white hover:!bg-white/10"
            >
              Submit a Talk
            </ButtonLink>
          </div>
        </div>
      </Container>
    </section>
  );
}
