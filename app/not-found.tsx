import Link from 'next/link';
import { Container } from '@/components/site/Container';
import { ButtonLink } from '@/components/ui/button';

export default function NotFound() {
  return (
    <Container className="py-24 text-center">
      <p className="text-sm font-semibold uppercase tracking-wider text-kcd-primary">404</p>
      <h1 className="mt-2 font-display text-4xl font-bold text-kcd-ink">Page not found</h1>
      <p className="mx-auto mt-3 max-w-md text-kcd-muted">
        The page you are looking for doesn&apos;t exist or has been moved.
      </p>
      <div className="mt-8">
        <ButtonLink href="/">Back to home</ButtonLink>
      </div>
    </Container>
  );
}
