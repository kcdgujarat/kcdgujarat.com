import * as React from 'react';
import { cn } from '@/lib/utils';

export function Badge({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border border-kcd-border bg-kcd-subtle px-2.5 py-0.5 text-xs font-medium text-kcd-ink',
        className,
      )}
      {...props}
    />
  );
}
