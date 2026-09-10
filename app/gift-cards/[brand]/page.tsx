"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Clock, Store } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { use } from "react";

import { getBrandBySlug } from "@/lib/mock-data/gift-card-catalog";

export default function BrandBuyPage({
  params,
}: {
  params: Promise<{ brand: string }>;
}) {
  const { brand: slug } = use(params);
  const brand = getBrandBySlug(slug);

  if (!brand) {
    return (
      <main className="flex flex-col items-center justify-center px-5 py-24">
        <p className="text-muted-foreground">Brand not found.</p>
        <Link href="/gift-cards" className="mt-4 text-primary underline">
          Back to Gift Cards
        </Link>
      </main>
    );
  }

  return (
    <main className="flex flex-col pb-28">
      <header className="relative overflow-hidden border-b border-border bg-[var(--color-card)] px-5 pb-6 pt-4">
        <div className="mb-5 flex items-center gap-3">
          <Link
            href="/gift-cards"
            className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white/60"
          >
            <ArrowLeft className="size-5 text-foreground" />
          </Link>
          <h1 className="font-heading text-xl font-semibold">Buy {brand.name}</h1>
        </div>

        <div className="relative mx-auto size-24 overflow-hidden rounded-full border border-border bg-white">
          <Image
            src={brand.image}
            alt={brand.name}
            fill
            className="object-cover"
            sizes="96px"
            priority
          />
        </div>
      </header>

      <motion.section
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto mt-10 w-full max-w-md space-y-4 px-5 text-center"
      >
        <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-[var(--color-muted)]">
          <Clock className="size-7 text-muted-foreground" />
        </div>

        <h2 className="font-heading text-lg font-semibold">Coming Soon</h2>

        <p className="text-sm leading-relaxed text-muted-foreground">
          Buying {brand.name} gift cards is coming soon. Right now you can{" "}
          <Link href={`/gift-cards/${slug}/sell`} className="text-primary underline">
            sell your {brand.name} gift cards
          </Link>{" "}
          for instant cash.
        </p>

        <Link
          href="/gift-cards"
          className="mt-4 inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-[var(--color-muted)]"
        >
          <Store className="size-4" />
          Browse all brands
        </Link>
      </motion.section>
    </main>
  );
}
