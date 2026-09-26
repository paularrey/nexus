import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type CardSectionProps = {
  children: ReactNode;
  className?: string;
  id?: string;
};

const CARD_SECTION_CLASSES =
  "rounded-[28px] border border-border bg-card p-5 md:p-8";

export function CardSection({
  children,
  className = CARD_SECTION_CLASSES,
  id,
}: CardSectionProps) {
  return (
    <section id={id} className={cn(CARD_SECTION_CLASSES, className)}>
      {children}
    </section>
  );
}
