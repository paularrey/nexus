"use client";

import { Drawer } from "vaul";
import { CreditCard, X } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/ui/PageHeader";
import { TransactionRow } from "@/components/ui/TransactionRow";
import { walletData } from "@/lib/mock-data/wallet";
import type { WalletTransaction } from "@/types";

export default function HistoryPage() {
  const [selectedTransaction, setSelectedTransaction] =
    useState<WalletTransaction | null>(null);

  return (
    <div className="mx-auto w-full max-w-5xl space-y-8">
      <PageHeader
        eyebrow="Activity"
        title="Transaction history"
        lede="Every payment, top-up, and booking — on the record."
      />

      <section>
        <div className="mb-4 flex items-end justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              All entries
            </p>
            <h2 className="mt-1 font-heading text-2xl font-semibold tracking-tight">
              {walletData.transactions.length} transactions
            </h2>
          </div>
        </div>
        <div className="space-y-2">
          {walletData.transactions.map((transaction) => (
            <TransactionRow
              key={transaction.id}
              transaction={transaction}
              onClick={() => setSelectedTransaction(transaction)}
            />
          ))}
        </div>
      </section>

      <Drawer.Root
        open={Boolean(selectedTransaction)}
        onOpenChange={(open) => !open && setSelectedTransaction(null)}
      >
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 z-40 bg-scrim backdrop-blur-sm" />
          <Drawer.Content className="fixed inset-x-0 bottom-0 z-50 mx-auto w-full max-w-md overflow-hidden rounded-t-[28px] border border-border bg-card p-4 pb-5 outline-none md:bottom-auto md:top-1/2 md:-translate-y-1/2 md:rounded-[28px] md:p-5">
            <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-muted md:hidden" />

            {selectedTransaction && (
              <>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="grid size-11 place-items-center rounded-2xl bg-secondary text-primary">
                      <CreditCard className="size-5" />
                    </div>
                    <div>
                      <Drawer.Title className="font-heading text-xl font-semibold">
                        {selectedTransaction.title}
                      </Drawer.Title>
                      <Drawer.Description className="mt-1 text-sm text-muted-foreground">
                        {selectedTransaction.description}
                      </Drawer.Description>
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon-sm"
                    type="button"
                    onClick={() => setSelectedTransaction(null)}
                    aria-label="Close transaction details"
                  >
                    <X />
                  </Button>
                </div>

                <div className="mt-6 rounded-[24px] border border-border bg-muted/50 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm text-muted-foreground">
                      Amount
                    </span>
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${selectedTransaction.amount.startsWith("+") ? "bg-success/10 text-success" : "bg-muted text-foreground"}`}
                    >
                      {selectedTransaction.status}
                    </span>
                  </div>
                  <div className="mt-4 text-3xl font-semibold tracking-tight">
                    {selectedTransaction.amount}
                  </div>
                </div>

                <div className="mt-6 space-y-3 rounded-[22px] border border-border bg-card p-4">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-sm text-muted-foreground">Date</span>
                    <span className="text-sm font-medium text-foreground">
                      {selectedTransaction.date}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-sm text-muted-foreground">
                      Reference
                    </span>
                    <span className="font-mono text-[11px] font-medium text-foreground">
                      {selectedTransaction.reference}
                    </span>
                  </div>
                </div>
              </>
            )}
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    </div>
  );
}
