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

type BadgeTone = "lavender" | "blue" | "pink" | "yellow";

type Service = {
  label: string;
  description: string;
  href: string;
  icon: LucideIcon;
  badge: BadgeTone;
};

const badgeClasses: Record<BadgeTone, string> = {
  lavender: "bg-badge-lavender text-badge-lavender-fg",
  blue: "bg-badge-blue text-badge-blue-fg",
  pink: "bg-badge-pink text-badge-pink-fg",
  yellow: "bg-badge-yellow text-badge-yellow-fg",
};

const services: Service[] = [
  {
    label: "Airtime & Data",
    description: "Top up any network in seconds",
    href: "/airtime",
    icon: Zap,
    badge: "lavender",
  },
  {
    label: "Bills",
    description: "Power, water & more",
    href: "/bills",
    icon: ReceiptText,
    badge: "blue",
  },
  {
    label: "Gift Cards",
    description: "Buy or sell instantly",
    href: "/gift-cards",
    icon: Gift,
    badge: "pink",
  },
  {
    label: "Wallet",
    description: "Send money to anyone",
    href: "/profile",
    icon: Send,
    badge: "yellow",
  },
  {
    label: "Subscriptions",
    description: "Renew your favorite plans",
    href: "/subscriptions",
    icon: RefreshCw,
    badge: "lavender",
  },
  {
    label: "History",
    description: "Track every naira spent",
    href: "/history",
    icon: Clock,
    badge: "blue",
  },
  {
    label: "Betting",
    description: "Fund betting wallets",
    href: "/betting",
    icon: Ticket,
    badge: "pink",
  },
  {
    label: "Bookings",
    description: "Book local services",
    href: "/bookings",
    icon: CalendarDays,
    badge: "yellow",
  },
  {
    label: "More",
    description: "Alerts, profile & settings",
    href: "/notifications",
    icon: Bell,
    badge: "lavender",
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
      <section className="relative overflow-hidden rounded-[28px] border border-border bg-surface p-6 shadow-[0_4px_24px_rgb(46_46_58_/_0.05)] md:p-8">
        <div className="absolute inset-x-0 top-0 h-0.5 bg-primary" />
        <div className="relative flex flex-wrap items-start justify-between gap-6">
          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">
              Ravecard
            </p>
            <p className="mt-4 text-sm text-muted-foreground">
              {labels.availableBalance}
            </p>
            <div className="mt-1 flex items-center gap-3">
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
              <button
                type="button"
                onClick={() => setBalanceVisible((visible) => !visible)}
                className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-surface-alt hover:text-foreground"
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
            <p className="mt-3 text-sm text-muted-foreground">
              {currentDate}
            </p>
          </div>
          <div className="flex flex-col items-end gap-3">
            <div className="grid size-11 place-items-center rounded-2xl bg-badge-lavender font-heading text-xl font-bold text-badge-lavender-fg">
              R
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
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-surface-alt"
              >
                <Clock className="size-4" />
                Activity
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="mb-5">
          <h2 className="font-heading text-2xl font-semibold tracking-tight md:text-3xl">
            What do you need today?
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Pick a service to get started — everything is one tap away.
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
                    className={`grid size-12 shrink-0 place-items-center rounded-full ${badgeClasses[service.badge]}`}
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
            <div className="grid size-11 place-items-center rounded-2xl bg-badge-lavender text-badge-lavender-fg">
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
