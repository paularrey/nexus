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
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { TransactionRow } from "@/components/ui/TransactionRow";
import { dashboardData } from "@/lib/mock-data/dashboard";
import { walletData } from "@/lib/mock-data/wallet";
import { formatAmount } from "@/lib/utils/format";
import { translations, usePreferences } from "@/lib/context/preferences-context";

type Service = {
  label: string;
  description: string;
  href: string;
  icon: LucideIcon;
};

const services: Service[] = [
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

  const [currentDate, setCurrentDate] = useState(() => {
    const now = new Date();
    return now.toLocaleDateString("en-NG", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setCurrentDate(
        now.toLocaleDateString("en-NG", {
          weekday: "long",
          month: "long",
          day: "numeric",
        }),
      );
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mx-auto w-full max-w-7xl space-y-8">
      <section className="relative overflow-hidden rounded-[28px] border border-white/10 bg-gradient-to-br from-[#1f1f1f] via-[#181818] to-[#141414] p-6 shadow-[0_24px_60px_rgb(0_0_0_/_0.45)] md:p-8">
        <div className="pointer-events-none absolute -right-24 -top-28 size-64 rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-primary via-primary/50 to-transparent" />

        <div className="relative flex items-start justify-between">
          <svg
            width="46"
            height="34"
            viewBox="0 0 46 34"
            fill="none"
            aria-hidden="true"
          >
            <rect
              x="1"
              y="1"
              width="44"
              height="32"
              rx="6"
              fill="#FF5733"
              stroke="rgb(18 18 18 / 0.35)"
            />
            <path
              d="M1 12h14M1 22h14M31 1h-8c-3 0-5 2-5 5v22c0 3 2 5 5 5h8M45 12H31M45 22H31"
              stroke="#121212"
              strokeWidth="2"
            />
            <rect
              x="15"
              y="1"
              width="16"
              height="32"
              stroke="#121212"
              strokeWidth="2"
            />
          </svg>
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            className="text-foreground/80"
            aria-hidden="true"
          >
            <path d="M8 8a6 6 0 0 1 0 8" />
            <path d="M12 5.5a10 10 0 0 1 0 13" />
            <path d="M16 3a14 14 0 0 1 0 17" />
          </svg>
        </div>

        <div className="relative mt-6 flex flex-wrap items-start justify-between gap-6">
          <div className="min-w-0">
            <div className="flex items-center gap-3">
              <p className="text-sm text-muted-foreground">
                {labels.availableBalance}
              </p>
              <button
                type="button"
                onClick={() => setBalanceVisible((visible) => !visible)}
                className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground"
                aria-label={
                  balanceVisible ? "Hide balance" : "Show balance"
                }
              >
                {balanceVisible ? (
                  <Eye className="size-4" />
                ) : (
                  <EyeOff className="size-4" />
                )}
              </button>
            </div>
            <div className="mt-1">
              <AnimatePresence mode="wait">
                <motion.span
                  key={balanceVisible ? "visible" : "hidden"}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="font-heading text-4xl font-semibold tracking-tight text-foreground md:text-5xl"
                >
                  {balanceVisible
                    ? `₦${formatAmount(dashboardData.balance)}`
                    : "₦ ••••••"}
                </motion.span>
              </AnimatePresence>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              {currentDate}
            </p>
          </div>
          <div className="flex gap-2">
            <Link
              href="/profile"
              className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover"
            >
              <Send className="size-4" />
              Send
            </Link>
            <Link
              href="/history"
              className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-white/10"
            >
              <Clock className="size-4" />
              Activity
            </Link>
          </div>
        </div>

        <div className="relative mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4">
          <p className="font-mono text-sm tracking-wider text-foreground/90">
            {dashboardData.cardNumber}
          </p>
          <p className="text-xs text-muted-foreground">
            {dashboardData.cardholder} · {dashboardData.expiry}
          </p>
        </div>

        <div className="relative mt-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-xl bg-primary font-heading text-lg font-bold text-primary-foreground">
              R
            </span>
            <span className="font-heading text-lg font-semibold tracking-tight text-foreground">
              Ravecard
            </span>
          </div>
          <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
            Spend Smarter. Live Freer.
          </span>
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
                  className="group flex h-full min-h-[148px] flex-col rounded-3xl border border-border bg-surface p-4 transition-all hover:-translate-y-1 hover:border-primary/35 hover:shadow-[0_12px_28px_rgb(46_46_58_/_0.08)] md:p-5"
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
