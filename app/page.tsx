"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUpRight,
  Bell,
  CalendarDays,
  Clock,
  Eye,
  EyeOff,
  Gift,
  ReceiptText,
  RefreshCw,
  Send,
  Ticket,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { TransactionRow } from "@/components/ui/TransactionRow";
import { translations, usePreferences } from "@/lib/context/preferences-context";
import { dashboardData } from "@/lib/mock-data/dashboard";
import { walletData } from "@/lib/mock-data/wallet";
import { formatNaira } from "@/lib/utils/format";
import type { ServiceLink } from "@/types";

const services: ServiceLink[] = [
  {
    label: "Airtime & Data",
    description: "Top up any network in seconds",
    href: "/airtime",
    icon: Zap,
  },
  {
    label: "Bills",
    description: "Power, water & more",
    href: "/bills",
    icon: ReceiptText,
  },
  {
    label: "Gift Cards",
    description: "Buy or sell instantly",
    href: "/gift-cards",
    icon: Gift,
  },
  {
    label: "Wallet",
    description: "Send money to anyone",
    href: "/profile",
    icon: Send,
  },
  {
    label: "Subscriptions",
    description: "Renew your favorite plans",
    href: "/subscriptions",
    icon: RefreshCw,
  },
  {
    label: "History",
    description: "Track every naira spent",
    href: "/history",
    icon: Clock,
  },
  {
    label: "Betting",
    description: "Fund betting wallets",
    href: "/betting",
    icon: Ticket,
  },
  {
    label: "Bookings",
    description: "Book local services",
    href: "/bookings",
    icon: CalendarDays,
  },
  {
    label: "More",
    description: "Alerts, profile & settings",
    href: "/notifications",
    icon: Bell,
  },
];

export default function Home() {
  const [balanceVisible, setBalanceVisible] = useState(true);
  const { language } = usePreferences();
  const labels = translations[language];

  return (
    <div className="mx-auto w-full max-w-7xl space-y-8">
      <section className="relative overflow-hidden rounded-[28px] border border-border bg-gradient-to-br from-surface to-background shadow-xl">
        {/* Soft accent glow — theme accent (--primary) at low opacity, top-right */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-32 -top-36 size-64 rounded-full bg-primary/15 blur-3xl"
        />
        {/* Thin accent line along the top edge */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-primary via-primary/40 to-transparent"
        />

        {/* Geometric diamond accents — confined to the top band + right edge,
            entirely clear of the balance number below */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <span className="absolute right-[7.5rem] top-3 size-14 rotate-45 rounded-md border border-primary/25" />
          <span className="absolute right-5 top-1.5 size-10 rotate-45 rounded-md border border-border" />
          <span className="absolute right-3 top-16 size-8 rotate-45 rounded-md border border-primary/15" />
        </div>

        <div className="relative z-10 p-6 md:p-8">
          {/* Top row: wordmark left, accent badge right */}
          <div className="flex items-center justify-between gap-4">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">
              Ravecard
            </p>
            <span className="grid size-11 shrink-0 place-items-center rounded-full bg-primary font-heading text-xl font-bold text-primary-foreground">
              R
            </span>
          </div>

          {/* Balance */}
          <div className="mt-8">
            <p className="text-sm text-muted-foreground">
              {labels.availableBalance}
            </p>
            <div className="mt-1 flex items-center gap-2">
              <AnimatePresence mode="wait">
                <motion.span
                  key={balanceVisible ? "visible" : "hidden"}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="font-heading text-4xl font-semibold tracking-tight text-foreground md:text-5xl"
                >
                  {balanceVisible
                    ? formatNaira(dashboardData.balance)
                    : "₦ ••••••"}
                </motion.span>
              </AnimatePresence>
              <button
                type="button"
                onClick={() => setBalanceVisible((visible) => !visible)}
                className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                aria-label={
                  balanceVisible ? "Hide balance" : "Show balance"
                }
              >
                {balanceVisible ? (
                  <Eye className="size-5" />
                ) : (
                  <EyeOff className="size-5" />
                )}
              </button>
            </div>
          </div>

          {/* Bottom row: member + masked number left, validity right */}
          <div className="mt-8 flex flex-wrap items-end justify-between gap-3 border-t border-border pt-4">
            <div className="min-w-0">
              <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                {dashboardData.cardholder}
              </p>
              <p className="mt-1 font-mono text-sm tracking-wider text-foreground">
                {dashboardData.cardNumber}
              </p>
            </div>
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
              Valid{" "}
              <span className="text-primary">{dashboardData.expiry}</span>
            </p>
          </div>
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
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
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
                  className="group flex h-full min-h-[148px] flex-col rounded-3xl border border-border bg-surface p-4 transition-all hover:-translate-y-1 hover:border-primary/35 hover:shadow-md md:p-5"
                >
                  <span
                    className="grid size-12 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground"
                  >
                    <Icon className="size-5" />
                  </span>
                  <span className="mt-auto pt-4 text-sm font-bold text-foreground md:text-base">
                    {service.label}
                  </span>
                  <span className="mt-1 text-xs leading-snug text-muted-foreground md:text-sm">
                    {service.description}
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
