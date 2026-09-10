"use client";

import { motion } from "framer-motion";
import { ArrowRight, Clock, Store } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { giftCardBrands } from "@/lib/mock-data/gift-card-catalog";

const formatPrice = (value: number) =>
  new Intl.NumberFormat("en-NG", {
    maximumFractionDigits: 0,
  }).format(value);

export default function GiftCardsPage() {
  const [mode, setMode] = useState<"buy" | "sell">("buy");

  return (
    <div className="mx-auto w-full max-w-5xl space-y-8">
      <header>
        <p className="text-sm font-medium text-primary">Gift cards</p>
        <h1 className="mt-1 font-heading text-3xl font-semibold tracking-tight md:text-4xl">
          Gift cards
        </h1>
        <p className="mt-2 max-w-xl text-muted-foreground">
          Buy gift cards for yourself or someone else. Instant delivery to your
          Nexus wallet.
        </p>
      </header>

      {/* ── Buy / Sell toggle ─────────────────────── */}
      <div className="grid grid-cols-2 rounded-2xl bg-muted p-1 sm:max-w-md">
        {(["buy", "sell"] as const).map((option) => (
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
            {option === "buy" ? "Buy" : "Sell"}
          </button>
        ))}
      </div>

      {/* ── Buy flow: brand grid ──────────────────── */}
      {mode === "buy" && (
        <section className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:gap-5">
          {giftCardBrands.map((brand, index) => (
            <motion.div
              key={brand.slug}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.06, duration: 0.35 }}
            >
              <Link
                href={`/gift-cards/${brand.slug}`}
                className="group block overflow-hidden rounded-[24px] border border-border bg-card transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-muted p-4">
                  <Image
                    src={brand.image}
                    alt={`${brand.name} gift card`}
                    fill
                    className="object-contain transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-heading text-lg font-semibold group-hover:text-primary">
                    {brand.name}
                  </h3>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {brand.category}
                  </p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-sm font-semibold text-primary">
                      From ₦{formatPrice(brand.startingPrice)}
                    </span>
                    <span className="flex size-7 items-center justify-center rounded-full bg-secondary text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                      <ArrowRight className="size-3.5" />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </section>
      )}

      {/* ── Sell flow: coming soon ─────────────────── */}
      {mode === "sell" && (
        <section className="rounded-[28px] border border-dashed border-border bg-card p-12 text-center">
          <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-muted">
            <Store className="size-7 text-muted-foreground" />
          </div>
          <h2 className="mt-5 font-heading text-xl font-semibold">
            Sell your gift cards
          </h2>
          <p className="mt-2 max-w-sm mx-auto text-sm text-muted-foreground">
            The ability to sell gift cards for instant Naira is coming soon.
            We&apos;re building the simplest way to convert unused cards into
            cash.
          </p>
          <div className="mt-5 inline-flex items-center gap-2 rounded-xl border border-border bg-muted/50 px-4 py-2.5 text-sm text-muted-foreground">
            <Clock className="size-4" />
            Coming soon
          </div>
        </section>
      )}
    </div>
  );
}
