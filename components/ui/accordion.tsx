'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

interface AccordionItemProps {
  question: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export function AccordionItem({ question, children, defaultOpen = false }: AccordionItemProps) {
  const [open, setOpen] = React.useState(defaultOpen);
  const id = React.useId();
  return (
    <div className="border-b border-kcd-border last:border-b-0">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-4 py-4 text-left text-base font-medium text-kcd-ink hover:text-kcd-primary"
      >
        <span>{question}</span>
        <ChevronDown
          className={cn('h-5 w-5 shrink-0 text-kcd-muted transition-transform', open && 'rotate-180')}
          aria-hidden
        />
      </button>
      <div
        id={id}
        hidden={!open}
        className="pb-4 text-kcd-muted prose prose-sm max-w-none"
      >
        {children}
      </div>
    </div>
  );
}
