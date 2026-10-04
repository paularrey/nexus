"use client";

import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Bell,
  Clock,
  Gift,
  Nfc,
  ReceiptText,
  RefreshCw,
  Send,
  Ticket,
  Zap,
} from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/Button";
import { TransactionRow } from "@/components/ui/TransactionRow";
import { translations, usePreferences } from "@/lib/context/preferences-context";
import { dashboardData } from "@/lib/mock-data/dashboard";
import { walletData } from "@/lib/mock-data/wallet";
import { formatNaira } from "@/lib/utils/format";
import { useHideBalance } from "@/lib/hooks/useHideBalance";
import type { ServiceLink } from "@/types";

const services: ServiceLink[] = [
  {
    label: "Airtime & Data",
    href: "/airtime",
    icon: Zap,
  },
  {
    label: "Bills",
    href: "/bills",
    icon: ReceiptText,
  },
  {
    label: "Gift Cards",
    href: "/gift-cards",
    icon: Gift,
  },
  {
    label: "Wallet",
    href: "/profile",
    icon: Send,
  },
  {
    label: "Subscriptions",
    href: "/subscriptions",
    icon: RefreshCw,
  },
  {
    label: "History",
    href: "/history",
    icon: Clock,
  },
  {
    label: "Betting",
    href: "/betting",
    icon: Ticket,
  },
  {
    label: "More",
    href: "/notifications",
    icon: Bell,
  },
];

export default function Home() {
  const { language } = usePreferences();
  const labels = translations[language];
  const { hideBalance } = useHideBalance();

  return (
    <div className="mx-auto w-full max-w-7xl space-y-8">
      <section className="rounded-[28px] border border-border bg-surface p-6 md:p-8">
        <div className="flex items-center justify-between gap-4">
          <p className="text-lg font-bold tracking-tight text-foreground">
            Ravecard
          </p>
          <Nfc className="size-6 shrink-0 text-primary" aria-hidden="true" />
        </div>

        <div className="mt-8">
          <p className="text-sm text-muted-foreground">
            {labels.availableBalance}
          </p>
          <p className="mt-1 font-heading text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            {hideBalance ? "₦ ••••••" : formatNaira(dashboardData.balance)}
          </p>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3">
          <Button asChild size="lg" className="gap-2">
            <Link href="/profile">
              <Send className="size-4" data-icon="inline-start" /> Send
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="gap-2 border-transparent bg-muted text-primary hover:bg-muted hover:text-primary"
          >
            <Link href="/history">
              <RefreshCw className="size-4" data-icon="inline-start" />{" "}
              Activity
            </Link>
          </Button>
        </div>
      </section>

      <section>
        <div className="mb-5">
          <h2 className="font-heading text-2xl font-semibold tracking-tight md:text-3xl">
            What do you need today?
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Built for how you actually live.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.href + service.label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04, duration: 0.3 }}
                whileTap={{ scale: 0.97 }}
                className="h-full"
              >
                <Link
                  href={service.href}
                  className="group flex h-full min-h-[124px] flex-col rounded-3xl border border-border bg-surface p-4 transition-all hover:-translate-y-1 hover:border-primary/35 hover:shadow-md md:p-5"
                >
                  <span
                    className="grid size-11 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground"
                  >
                    <Icon className="size-5" />
                  </span>
                  <span className="mt-auto pt-4 text-sm font-bold text-foreground md:text-base">
                    {service.label}
                  </span>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        <div className="flex flex-col justify-between overflow-hidden rounded-[28px] border border-border bg-surface p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
                {labels.pulseNote}
              </p>
              <h2 className="mt-2 font-heading text-2xl font-semibold tracking-tight">
                {labels.smallMoves}
              </h2>
            </div>
            <div className="grid size-11 place-items-center rounded-full bg-primary text-primary-foreground">
              <Zap className="size-5" />
            </div>
          </div>
          <div className="overflow-hidden border-y border-border py-4">
            <motion.div
              animate={{ x: [0, -520] }}
              transition={{ repeat: Infinity, duration: 16, ease: "linear" }}
              className="flex w-max gap-8 whitespace-nowrap text-sm text-muted-foreground"
            >
              {[...dashboardData.ticker, ...dashboardData.ticker].map(
                (message, index) => (
                  <span
                    key={`${message}-${index}`}
                    className="flex items-center gap-8"
                  >
                    {message}
                    <span className="text-primary">•</span>
                  </span>
                ),
              )}
            </motion.div>
          </div>
          <Link
            href="/history"
            className="mt-4 flex items-center justify-between text-sm font-semibold text-primary"
          >
            {labels.checkActivity} <ArrowUpRight className="size-4" />
          </Link>
        </div>

        <div>
          <div className="mb-4 flex items-end justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                {labels.recentTransactions}
              </p>
              <h2 className="mt-1 font-heading text-2xl font-semibold tracking-tight">
                Recent activity
              </h2>
            </div>
            <Link
              href="/history"
              className="flex items-center gap-1 text-sm font-semibold text-primary"
            >
              View all <ArrowUpRight className="size-3.5" />
            </Link>
          </div>
          <div className="space-y-2">
            {walletData.transactions.slice(0, 3).map((transaction) => (
              <TransactionRow key={transaction.id} transaction={transaction} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
