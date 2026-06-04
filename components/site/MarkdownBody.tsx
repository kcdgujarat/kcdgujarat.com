import { cn } from '@/lib/utils';

type MarkdownBodyProps = {
  html: string;
  className?: string;
};

/** Server-safe wrapper for remark-rendered HTML with Tailwind Typography. */
export function MarkdownBody({ html, className }: MarkdownBodyProps) {
  if (!html.trim()) return null;

  return (
    <div
      className={cn('prose prose-sm max-w-3xl text-kcd-ink', className)}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
