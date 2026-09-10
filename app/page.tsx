"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUpRight,
  CreditCard,
  Dot,
  Eye,
  EyeOff,
  Gift,
  MoreHorizontal,
  ReceiptText,
  Store,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { dashboardData } from "@/lib/mock-data/dashboard";
import { walletData } from "@/lib/mock-data/wallet";
import {
  translations,
  usePreferences,
} from "@/lib/context/preferences-context";

const shortcutIcons = {
  zap: Zap,
  bills: ReceiptText,
  betting: ArrowUpRight,
  gift: Gift,
  store: Store,
  more: MoreHorizontal,
};

const toneClasses = {
  blue: "bg-blue-500/15 text-blue-400",
  orange: "bg-primary/15 text-primary",
  green: "bg-emerald-500/15 text-emerald-400",
};

const formatBalance = (value: number) =>
  new Intl.NumberFormat("en-NG", {
    maximumFractionDigits: 0,
  }).format(value);

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
      const formatted = now.toLocaleDateString("en-NG", {
        weekday: "long",
        month: "long",
        day: "numeric",
      });
      setCurrentDate(formatted);
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mx-auto w-full max-w-7xl space-y-8">
      <section className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-medium text-primary">
            {currentDate}
          </p>
          <h1 className="mt-1 font-heading text-3xl font-semibold tracking-tight md:text-4xl">
            {labels.homeTitle}
          </h1>
          <p className="mt-2 max-w-xl text-muted-foreground">
            {labels.homeDescription}
          </p>
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-[minmax(0,1.15fr)_minmax(280px,0.85fr)]">
        <motion.div
          whileHover={{ rotateX: 2, rotateY: -3, y: -4 }}
          transition={{ type: "spring", stiffness: 220, damping: 20 }}
          style={{ transformPerspective: 1200 }}
          className="group relative min-h-[250px] overflow-hidden rounded-[28px] bg-gradient-to-br from-[#c44420] to-[#FF5733] p-6 text-white shadow-[0_4px_24px_rgba(255,87,51,0.25)] md:min-h-[300px] md:p-8"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_15%,rgba(255,150,120,0.5),transparent_30%),radial-gradient(circle_at_20%_100%,rgba(255,87,51,0.6),transparent_50%)]" />
          <div className="absolute -right-16 top-12 size-64 rotate-45 border border-white/15 transition-transform duration-700 group-hover:translate-x-8" />
          <div className="absolute -right-4 top-28 size-44 rotate-45 border border-orange-300/25" />
          <div className="relative flex h-full flex-col justify-between">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-white/60">
                  Ravecard
                </p>
                <p className="mt-4 text-sm text-white/60">
                  {labels.availableBalance}
                </p>
                <div className="mt-1 flex items-center gap-3">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={balanceVisible ? "visible" : "hidden"}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="font-heading text-4xl font-semibold tracking-tight md:text-5xl"
                    >
                      {balanceVisible
                        ? `₦${formatBalance(dashboardData.balance)}`
                        : "₦ ••••••"}
                    </motion.span>
                  </AnimatePresence>
                  <button
                    type="button"
                    onClick={() => setBalanceVisible((visible) => !visible)}
                    className="rounded-full p-2 text-white/60 transition-colors hover:bg-white/10 hover:text-white"
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
              <div className="grid size-11 place-items-center rounded-2xl border border-white/20 bg-white/10 font-heading text-xl font-bold">
                R
              </div>
            </div>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-sm text-white/60">
                  {dashboardData.cardholder}
                </p>
                <p className="mt-2 font-mono text-sm tracking-[0.16em] text-white/90">
                  {dashboardData.cardNumber}
                </p>
                <p className="mt-1 text-xs text-white/50">
                  {walletData.bankName} · {walletData.accountNumber}
                </p>
              </div>
              <p className="font-mono text-xs text-white/60">
                VALID {dashboardData.expiry}
              </p>
            </div>
          </div>
        </motion.div>

        <div className="flex min-h-[250px] flex-col justify-between overflow-hidden rounded-[28px] border border-border bg-card p-6 md:min-h-[300px] md:p-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
                {labels.pulseNote}
              </p>
              <h2 className="mt-2 font-heading text-2xl font-semibold tracking-tight">
                {labels.smallMoves}
              </h2>
            </div>
            <div className="grid size-11 place-items-center rounded-2xl bg-primary/15 text-primary">
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
                    {message} <span className="text-accent"><Dot className="size-4" /></span>
                  </span>
                ),
              )}
            </motion.div>
          </div>
          <Link
            href="/history"
            className="flex items-center justify-between text-sm font-semibold text-primary"
          >
            {labels.checkActivity} <ArrowUpRight className="size-4" />
          </Link>
        </div>
      </section>

      <section>
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
            <div
              key={transaction.id}
              className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-card px-3 py-3 md:px-4"
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
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-end justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              {labels.quickAccess}
            </p>
            <h2 className="mt-1 font-heading text-2xl font-semibold tracking-tight">
              {labels.quickAccess}
            </h2>
          </div>
          <span className="text-sm text-muted-foreground">
            {dashboardData.shortcuts.length} services
          </span>
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-7">
          {dashboardData.shortcuts.map((shortcut, index) => {
            const Icon = shortcutIcons[shortcut.icon];
            return (
              <motion.div
                key={shortcut.href}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.06, duration: 0.35 }}
                whileTap={{ scale: 0.96 }}
              >
                <Link
                  href={shortcut.href}
                  className="group block rounded-2xl border border-border bg-card p-4 transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg"
                >
                  <div
                    className={`mb-8 grid size-10 place-items-center rounded-xl ${toneClasses[shortcut.tone]}`}
                  >
                    <Icon className="size-5" />
                  </div>
                  <p className="font-semibold">{shortcut.label}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {shortcut.description}
                  </p>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
