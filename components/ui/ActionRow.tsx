"use client";

import type { LucideIcon } from "lucide-react";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type ActionRowProps = {
  icon: LucideIcon;
  label: string;
  description?: string;
  value?: string;
  danger?: boolean;
  chevron?: boolean;
  href?: string;
  onClick?: () => void;
  trailing?: ReactNode;
};

export function ActionRow({
  icon: Icon,
  label,
  description,
  value,
  danger = false,
  chevron = true,
  href,
  onClick,
  trailing,
}: ActionRowProps) {
  const content = (
    <>
      <span
        className={cn(
          "grid size-10 shrink-0 place-items-center rounded-xl",
          danger ? "bg-danger/10 text-danger" : "bg-secondary text-primary",
        )}
      >
        <Icon className="size-5" />
      </span>
      <span className="min-w-0 flex-1 text-left">
        <span className={cn("block font-medium", danger && "text-danger")}>
          {label}
        </span>
        {description && (
          <span className="mt-0.5 block text-sm text-muted-foreground">
            {description}
          </span>
        )}
      </span>
      {value && (
        <span className="shrink-0 text-sm text-muted-foreground">{value}</span>
      )}
      {trailing !== undefined ? (
        trailing
      ) : (
        chevron && <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
      )}
    </>
  );

  const className = cn(
    "flex w-full items-center gap-3 border-b border-border py-4 text-sm last:border-b-0 focus-visible:outline-2 focus-visible:outline-ring",
  );

  if (href) {
    return (
      <Link href={href} className={className}>
        {content}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={className}>
      {content}
    </button>
  );
}
