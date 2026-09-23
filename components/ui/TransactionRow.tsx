"use client";

import { CreditCard } from "lucide-react";

import { cn } from "@/lib/utils";
import type { WalletTransaction } from "@/types";

type TransactionRowProps = {
  transaction: WalletTransaction;
  onClick?: () => void;
  className?: string;
};

export function TransactionRow({
  transaction,
  onClick,
  className,
}: TransactionRowProps) {
  const classes = cn(
    "flex items-center justify-between gap-3 rounded-2xl border border-border bg-card px-3 py-3 md:px-4",
    onClick &&
      "w-full text-left transition-all hover:border-primary/20 hover:bg-muted/30",
    className,
  );

  const content = (
    <>
      <span className="flex min-w-0 items-center gap-3">
        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-secondary text-primary">
          <CreditCard className="size-5" />
        </span>
        <span className="min-w-0">
          <span className="block truncate text-sm font-semibold">
            {transaction.title}
          </span>
          <span className="mt-1 block truncate text-xs text-muted-foreground">
            {transaction.description}
          </span>
        </span>
      </span>
      <span className="shrink-0 text-right">
        <span
          className={`block text-sm font-semibold ${
            transaction.amount.startsWith("+")
              ? "text-success"
              : "text-foreground"
          }`}
        >
          {transaction.amount}
        </span>
        <span className="mt-1 block text-[11px] text-muted-foreground">
          {transaction.date}
        </span>
      </span>
    </>
  );

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={classes}>
        {content}
      </button>
    );
  }

  return <div className={classes}>{content}</div>;
}
