"use client";

import { Drawer } from "vaul";
import { Check, Copy, CreditCard, Landmark, Smartphone, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { walletData, type WalletTransaction } from "@/lib/mock-data/wallet";
import {
  translations,
  usePreferences,
} from "@/lib/context/preferences-context";

const paymentTabs = [
  { label: "Virtual Account", icon: Landmark },
  { label: "Card Payment", icon: CreditCard },
  { label: "USSD", icon: Smartphone },
] as const;

type PaymentTab = (typeof paymentTabs)[number]["label"];

export default function WalletPage() {
  const { language } = usePreferences();
  const labels = translations[language];
  const [activeTab, setActiveTab] = useState<PaymentTab>("Virtual Account");
  const [copied, setCopied] = useState(false);
  const [selectedTransaction, setSelectedTransaction] =
    useState<WalletTransaction | null>(null);

  const copyAccountNumber = async () => {
    await navigator.clipboard.writeText(walletData.accountNumber);
    setCopied(true);
    toast.success("Account number copied");
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="mx-auto w-full max-w-5xl space-y-8">
      <header>
        <p className="text-sm font-medium text-primary">Your wallet</p>
        <h1 className="mt-1 font-heading text-3xl font-semibold tracking-tight md:text-4xl">
          {labels.walletTitle}
        </h1>
        <p className="mt-2 text-muted-foreground">
          View your account details and recent activity in one place.
        </p>
      </header>

      <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="relative overflow-hidden rounded-[28px] bg-[#0b1f3a] p-6 text-white shadow-[0_20px_50px_rgba(11,31,58,0.18)] md:p-8">
          <div className="absolute -right-20 -top-20 size-64 rotate-45 border border-white/10" />
          <div className="absolute bottom-[-100px] left-[-40px] size-72 rounded-full border border-orange-300/20" />
          <div className="relative">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-blue-100/65">
                  {walletData.bankName}
                </p>
                <h2 className="mt-8 font-heading text-2xl font-semibold">
                  {walletData.accountName}
                </h2>
              </div>
              <Landmark className="size-6 text-orange-300" />
            </div>
            <p className="mt-10 text-sm text-blue-100/65">
              Virtual account number
            </p>
            <div className="mt-2 flex items-center gap-3">
              <p className="font-mono text-2xl tracking-[0.14em]">
                {walletData.accountNumber}
              </p>
              <Button
                variant="ghost"
                size="icon-sm"
                type="button"
                onClick={copyAccountNumber}
                className="text-white hover:bg-white/10 hover:text-white"
                aria-label={
                  copied ? "Account number copied" : "Copy account number"
                }
              >
                {copied ? <Check className="text-emerald-300" /> : <Copy />}
              </Button>
            </div>
            <p className="mt-3 text-sm text-blue-100/65">
              Available balance {walletData.balance}
            </p>
          </div>
        </section>

        <section className="rounded-[28px] border border-border bg-card p-5 md:p-7">
          <p className="text-sm font-medium text-muted-foreground">
            Choose a way to fund
          </p>
          <div className="mt-5 grid grid-cols-1 gap-2 rounded-2xl bg-muted p-1 sm:grid-cols-3 lg:grid-cols-1">
            {paymentTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.label;
              return (
                <button
                  key={tab.label}
                  type="button"
                  onClick={() => setActiveTab(tab.label)}
                  className={`relative flex items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium transition-colors ${isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                >
                  {isActive && (
                    <span className="absolute inset-0 rounded-xl bg-card shadow-sm" />
                  )}
                  <Icon className="relative size-4" />
                  <span className="relative">{tab.label}</span>
                </button>
              );
            })}
          </div>
          <div className="mt-6 border-t border-border pt-5">
            <h2 className="font-heading text-xl font-semibold">{activeTab}</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {activeTab === "Virtual Account" &&
                "Share your virtual account number to receive funds."}
              {activeTab === "Card Payment" &&
                "Card funding will be available when payments are connected."}
              {activeTab === "USSD" &&
                "USSD funding instructions will appear here when enabled."}
            </p>
          </div>
        </section>
      </div>

      <section>
        <div className="mb-4 flex items-end justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Activity
            </p>
            <h2 className="mt-1 font-heading text-2xl font-semibold tracking-tight">
              {labels.recentTransactions}
            </h2>
          </div>
          <span className="text-sm text-muted-foreground">
            {walletData.transactions.length} entries
          </span>
        </div>
        <div className="space-y-2">
          {walletData.transactions.map((transaction) => (
            <button
              key={transaction.id}
              type="button"
              onClick={() => setSelectedTransaction(transaction)}
              className="flex w-full items-center justify-between gap-3 rounded-[20px] border border-border bg-card px-3 py-3 text-left transition-all hover:border-primary/20 hover:bg-muted/30 md:px-4"
            >
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
                  className={`block text-sm font-semibold ${transaction.amount.startsWith("+") ? "text-success" : "text-foreground"}`}
                >
                  {transaction.amount}
                </span>
                <span className="mt-1 block text-[11px] text-muted-foreground">
                  {transaction.date}
                </span>
              </span>
            </button>
          ))}
        </div>
      </section>

      <Drawer.Root
        open={Boolean(selectedTransaction)}
        onOpenChange={(open) => !open && setSelectedTransaction(null)}
      >
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm" />
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
