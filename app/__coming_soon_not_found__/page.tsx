import { notFound } from 'next/navigation';

/** Middleware rewrite target — renders the global not-found UI with a 404 status. */
export default function ComingSoonNotFound() {
  notFound();
}
