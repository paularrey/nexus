"use client";

import { motion } from "framer-motion";
import { ArrowRight, Search, Store } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

import { giftCardBrands } from "@/lib/mock-data/gift-card-catalog";

const formatPrice = (value: number) =>
  new Intl.NumberFormat("en-NG", {
    maximumFractionDigits: 0,
  }).format(value);

// TODO: Connect to real exchange rate data
const mockRates: Record<string, string> = {
  amazon: "Up to ₦950/$1",
  apple: "Up to ₦920/$1",
  "google-play": "Up to ₦900/$1",
  razer: "Up to ₦880/$1",
  spotify: "Up to ₦850/$1",
  steam: "Up to ₦910/$1",
};

export default function GiftCardsPage() {
  const [mode, setMode] = useState<"sell" | "buy">("sell");
  const [search, setSearch] = useState("");

  const filteredBrands = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return giftCardBrands;
    return giftCardBrands.filter(
      (brand) =>
        brand.name.toLowerCase().includes(query) ||
        brand.category.toLowerCase().includes(query),
    );
  }, [search]);

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">
      <header>
        <p className="text-sm font-medium text-primary">Gift cards</p>
        <h1 className="mt-1 font-heading text-3xl font-semibold tracking-tight md:text-4xl">
          Gift cards
        </h1>
        <p className="mt-2 max-w-xl text-muted-foreground">
          Sell your unused gift cards for instant cash or buy one for someone
          special.
        </p>
      </header>

      {/* ── Sell / Buy toggle ─────────────────────── */}
      <div className="grid grid-cols-2 rounded-2xl bg-muted p-1 sm:max-w-md">
        {(["sell", "buy"] as const).map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => setMode(option)}
            className={`rounded-xl px-4 py-3 text-sm font-semibold capitalize transition-colors ${
              mode === option
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
            aria-pressed={mode === option}
          >
            {option === "sell" ? "Sell" : "Buy"}
          </button>
        ))}
      </div>

      {/* ── Sell tab ──────────────────────────────── */}
      {mode === "sell" && (
        <>
          {/* Search bar */}
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search for a gift card brand"
              className="h-12 w-full rounded-2xl border border-border bg-card pl-11 pr-4 text-sm outline-none transition focus:border-primary focus:ring-3 focus:ring-primary/15"
            />
          </div>

          {/* Quick brand rail */}
          <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-1 scrollbar-none sm:mx-0 sm:px-0">
            {giftCardBrands.map((brand) => (
              <Link
                key={brand.slug}
                href={`/gift-cards/${brand.slug}/sell`}
                className="group flex shrink-0 flex-col items-center gap-1.5"
              >
                <span className="relative size-14 overflow-hidden rounded-full border-2 border-border bg-card transition-colors group-hover:border-primary/40">
                  <Image
                    src={brand.image}
                    alt={brand.name}
                    fill
                    className="object-cover"
                    sizes="56px"
                  />
                </span>
                <span className="text-[11px] font-medium text-muted-foreground group-hover:text-foreground">
                  {brand.name}
                </span>
              </Link>
            ))}
          </div>

          {/* Brand list */}
          <section>
            {filteredBrands.length === 0 && (
              <div className="rounded-[28px] border border-dashed border-border bg-card p-12 text-center">
                <p className="text-lg font-semibold text-muted-foreground">
                  No results for &ldquo;{search}&rdquo;
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Try a different search term.
                </p>
              </div>
            )}

            <div className="space-y-2">
              {filteredBrands.map((brand, index) => (
                <motion.div
                  key={brand.slug}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.04, duration: 0.3 }}
                >
                  <Link
                    href={`/gift-cards/${brand.slug}/sell`}
                    className="group flex items-center gap-4 rounded-2xl border border-border bg-card px-4 py-3 transition-all hover:border-primary/30 hover:bg-muted/30 md:px-5"
                  >
                    <span className="relative size-12 shrink-0 overflow-hidden rounded-full bg-muted">
                      <Image
                        src={brand.image}
                        alt={brand.name}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold group-hover:text-primary">
                        {brand.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {mockRates[brand.slug] ?? "Rate updating"} · {brand.category}
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-primary">
                      From ₦{formatPrice(brand.startingPrice)}
                    </span>
                    <ArrowRight className="size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
                  </Link>
                </motion.div>
              ))}
            </div>
          </section>
        </>
      )}

      {/* ── Buy tab: Coming soon ──────────────────── */}
      {mode === "buy" && (
        <section className="rounded-[28px] border border-dashed border-border bg-card p-12 text-center">
          <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-muted">
            <Store className="size-7 text-muted-foreground" />
          </div>
          <h2 className="mt-5 font-heading text-xl font-semibold">
            Buy gift cards
          </h2>
          <p className="mt-2 max-w-sm mx-auto text-sm text-muted-foreground">
            Purchasing gift cards directly from Nexus is coming soon. For now,
            you can sell any gift card you already have for instant cash.
          </p>
          <div className="mt-5 inline-flex items-center gap-2 rounded-xl border border-border bg-muted/50 px-4 py-2.5 text-sm text-muted-foreground">
            Coming soon
          </div>
        </section>
      )}
    </div>
  );
}
