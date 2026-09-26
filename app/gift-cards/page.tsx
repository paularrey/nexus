"use client";

import { motion } from "framer-motion";
import { ArrowRight, Store } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/ui/PageHeader";
import { SearchInput } from "@/components/ui/SearchInput";
import { SegmentedToggle } from "@/components/ui/SegmentedToggle";
import {
  giftCardBrands,
  giftCardRates,
} from "@/lib/mock-data/gift-card-catalog";
import { formatNaira } from "@/lib/utils/format";

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
      <PageHeader
        eyebrow="Gift cards"
        title="Gift cards"
        lede="Sell your unused gift cards for instant cash. Your card. Your rules. Your freedom."
        ledeClassName="mt-2 max-w-xl text-muted-foreground"
      />

      <SegmentedToggle
        options={["sell", "buy"] as const}
        value={mode}
        onChange={setMode}
        className="sm:max-w-md"
      />

      {mode === "sell" && (
        <>
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search for a gift card brand"
            aria-label="Search gift card brands"
          />

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

          <section>
            {filteredBrands.length === 0 && (
              <EmptyState
                title={`No results for “${search}”`}
                description="Try a different search term."
              />
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
                        {giftCardRates[brand.slug] ?? "Rate updating"} ·{" "}
                        {brand.category}
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-primary">
                      From {formatNaira(brand.startingPrice)}
                    </span>
                    <ArrowRight className="size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
                  </Link>
                </motion.div>
              ))}
            </div>
          </section>
        </>
      )}

      {mode === "buy" && (
        <section className="rounded-[28px] border border-dashed border-border bg-card p-12 text-center">
          <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-muted">
            <Store className="size-7 text-muted-foreground" />
          </div>
          <h2 className="mt-5 font-heading text-xl font-semibold">
            Buy gift cards
          </h2>
          <p className="mt-2 max-w-sm mx-auto text-sm text-muted-foreground">
            Buy is coming soon. Until then, sell any gift card you own for
            instant cash — no waiting around.
          </p>
          <div className="mt-5 inline-flex items-center gap-2 rounded-xl border border-border bg-muted/50 px-4 py-2.5 text-sm text-muted-foreground">
            Coming soon
          </div>
        </section>
      )}
    </div>
  );
}
