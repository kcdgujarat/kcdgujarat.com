import * as React from 'react';
import { cn } from '@/lib/utils';

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
  className?: string;
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = 'left',
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn('mb-10', align === 'center' && 'text-center', className)}>
      {eyebrow && (
        <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-kcd-primary">{eyebrow}</p>
      )}
      <h2 className="font-display text-3xl font-bold text-kcd-ink sm:text-4xl">{title}</h2>
      {description && (
        <p className={cn('mt-3 max-w-2xl text-base text-kcd-muted', align === 'center' && 'mx-auto')}>
          {description}
        </p>
      )}
    </div>
  );
}
