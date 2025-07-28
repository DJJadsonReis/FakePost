
'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface EditorSectionProps {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

export function EditorSection({
  id,
  title,
  description,
  icon,
  children,
}: EditorSectionProps) {
  return (
    <AccordionItem value={id}>
      <AccordionTrigger>
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
            {icon}
          </div>
          <div>
            <p className="font-semibold text-left">{title}</p>
            <p className="text-xs text-muted-foreground text-left">{description}</p>
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent className="p-1">
        {children}
      </AccordionContent>
    </AccordionItem>
  );
}

    