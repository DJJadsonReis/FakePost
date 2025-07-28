'use client';

import {
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
    <AccordionItem value={id} className="border-b-0">
      <AccordionTrigger className="hover:no-underline">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-muted-foreground">
            {icon}
          </div>
          <div>
            <p className="font-semibold text-left text-card-foreground">{title}</p>
            <p className="text-xs text-muted-foreground text-left">{description}</p>
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent>
        <div className="pl-12">
            {children}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
