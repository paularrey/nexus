"use client";

import { motion } from "framer-motion";
import { MapPin, Search, Star } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

import {
  categories,
  marketplaceListings,
  type MarketplaceCategory,
} from "@/lib/mock-data/marketplace";

const categoryColors: Record<MarketplaceCategory, string> = {
  Hair: "#d946ef",
  Nails: "#f43f5e",
  Spa: "#8b5cf6",
  Cleaning: "#06b6d4",
  "Home Repairs": "#f97316",
  Photography: "#3b82f6",
};

export default function MarketplacePage() {
  const [activeCategory, setActiveCategory] = useState<
    MarketplaceCategory | "All"
  >("All");
  const [search, setSearch] = useState("");

  const filteredListings = useMemo(() => {
    return marketplaceListings.filter((listing) => {
      const matchesCategory =
        activeCategory === "All" || listing.category === activeCategory;
      const matchesSearch =
        !search ||
        listing.name.toLowerCase().includes(search.toLowerCase()) ||
        listing.description.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, search]);

  return (
    <div className="mx-auto w-full max-w-6xl space-y-8">
      <header>
        <p className="text-sm font-medium text-primary">Services marketplace</p>
        <h1 className="mt-1 font-heading text-3xl font-semibold tracking-tight md:text-4xl">
          Find local services you trust.
        </h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Browse verified providers, compare prices, and book instantly — all in
          one place.
        </p>
      </header>

      {/* ── Search bar ─────────────────────────────── */}
      <div className="relative">
        <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search services or providers..."
          className="h-12 w-full rounded-2xl border border-border bg-card pl-11 pr-4 text-sm outline-none transition focus:border-primary focus:ring-3 focus:ring-primary/15"
        />
      </div>

      {/* ── Category filter chips ──────────────────── */}
      <div className="flex flex-wrap gap-2">
        {(["All", ...categories] as const).map((category) => {
          const isActive = activeCategory === category;
          return (
            <motion.button
              key={category}
              type="button"
              whileTap={{ scale: 0.93 }}
              onClick={() => setActiveCategory(category)}
              className={`rounded-xl border px-4 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"
              }`}
            >
              {category}
            </motion.button>
          );
        })}
      </div>

      {/* ── Listings grid ──────────────────────────── */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredListings.map((listing, index) => {
          const color = categoryColors[listing.category];
          return (
            <motion.div
              key={listing.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.35 }}
            >
              <Link
                href={`/bookings/${listing.id}/book`}
                className="group block overflow-hidden rounded-[24px] border border-border bg-card transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl"
              >
                {/* ── Image placeholder ─────────────── */}
                <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 border-2 border-dashed border-border bg-muted/50 text-muted-foreground">
                    <span className="text-xs font-medium">
                      Add your image here
                    </span>
                    <span className="text-[10px] opacity-60">
                      {listing.image}
                    </span>
                  </div>

                  {/* Category badge — sits on top of image */}
                  <span
                    className="absolute left-3 top-3 rounded-lg px-2.5 py-1 text-[11px] font-semibold text-white"
                    style={{ backgroundColor: color }}
                  >
                    {listing.category}
                  </span>
                </div>

                {/* ── Card body ──────────────────────── */}
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-heading text-lg font-semibold group-hover:text-primary">
                      {listing.name}
                    </h3>
                    <span className="flex shrink-0 items-center gap-1 rounded-lg bg-success/10 px-2 py-0.5 text-xs font-semibold text-success">
                      <Star className="size-3 fill-current" />
                      {listing.rating}
                    </span>
                  </div>

                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                    {listing.description}
                  </p>

                  <div className="mt-3 flex items-center justify-between">
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="size-3" />
                      {listing.location}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {listing.reviews} reviews
                    </span>
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
                    <span className="font-heading text-xl font-semibold text-foreground">
                      ₦{listing.price.toLocaleString("en-NG")}
                    </span>
                    <span
                      className="rounded-xl px-4 py-2 text-sm font-semibold text-white transition-transform group-hover:scale-105"
                      style={{ backgroundColor: color }}
                    >
                      Book Now
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </section>

      {filteredListings.length === 0 && (
        <div className="rounded-[28px] border border-dashed border-border bg-card p-12 text-center">
          <p className="text-lg font-semibold text-muted-foreground">
            No services found
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Try a different search term or category.
          </p>
        </div>
      )}
    </div>
  );
}
