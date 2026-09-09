"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  Check,
  ChevronDown,
  Clock,
  MapPin,
  Star,
} from "lucide-react";
import Link from "next/link";
import { use, useMemo, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { PinModal } from "@/components/PinModal";
import { useAuthGate } from "@/hooks/useAuthGate";
import { marketplaceListings } from "@/lib/mock-data/marketplace";

const SERVICE_FEE = 500;
const BOOKING_FEE = 200;

const generateCalendarDays = () => {
  const today = new Date();
  const days: { date: Date; label: string; dayName: string }[] = [];
  for (let i = 0; i < 14; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    days.push({
      date: d,
      label: d.toLocaleDateString("en-NG", { day: "numeric", month: "short" }),
      dayName: d.toLocaleDateString("en-NG", { weekday: "short" }),
    });
  }
  return days;
};

export default function BookingReviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const listing = marketplaceListings.find((l) => l.id === id);

  const [selectedDate, setSelectedDate] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [feeOpen, setFeeOpen] = useState(false);
  const [pinOpen, setPinOpen] = useState(false);
  const authGate = useAuthGate();

  const calendarDays = useMemo(() => generateCalendarDays(), []);

  if (!listing) {
    return (
      <div className="mx-auto w-full max-w-5xl space-y-8">
        <Link
          href="/marketplace"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" /> Back to marketplace
        </Link>
        <div className="rounded-[28px] border border-dashed border-border bg-card p-12 text-center">
          <p className="text-lg font-semibold text-muted-foreground">
            Service not found
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            This listing may have been removed.
          </p>
        </div>
      </div>
    );
  }

  const total = listing.price + SERVICE_FEE + BOOKING_FEE;

  const availableSlotsForDate = useMemo(() => {
    const day = calendarDays[selectedDate];
    if (!day) return listing.availableSlots;
    // Simple filter: show slots that start with the day abbreviation
    const dayAbbr = day.dayName.slice(0, 3);
    const matched = listing.availableSlots.filter((slot) =>
      slot.startsWith(dayAbbr),
    );
    // If no match for this day, show all slots as fallback
    return matched.length > 0 ? matched : listing.availableSlots;
  }, [selectedDate, calendarDays, listing.availableSlots]);

  const confirmBooking = () => {
    authGate(() => setPinOpen(true));
  };

  return (
    <div className="mx-auto w-full max-w-5xl space-y-8">
      {/* ── Back link ──────────────────────────────── */}
      <Link
        href="/marketplace"
        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Back to marketplace
      </Link>

      {/* ── Provider hero ──────────────────────────── */}
      <section className="overflow-hidden rounded-[28px] border border-border bg-card">
        {/* Image placeholder banner */}
        <div className="relative aspect-[21/8] bg-muted md:aspect-[21/6]">
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 border-2 border-dashed border-border bg-muted/50 text-muted-foreground">
            <span className="text-sm font-medium">Add your image here</span>
            <span className="text-xs opacity-60">{listing.image}</span>
          </div>
        </div>

        <div className="p-5 md:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <span className="inline-block rounded-lg bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                {listing.category}
              </span>
              <h1 className="mt-3 font-heading text-2xl font-semibold tracking-tight md:text-3xl">
                {listing.name}
              </h1>
              <p className="mt-2 max-w-xl text-muted-foreground">
                {listing.description}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Star className="size-4 fill-current text-warning" />
                  {listing.rating} ({listing.reviews} reviews)
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="size-4" />
                  {listing.location}
                </span>
              </div>
            </div>
            <div className="shrink-0 rounded-2xl bg-muted/50 px-5 py-3 text-right">
              <p className="text-xs text-muted-foreground">Starting from</p>
              <p className="font-heading text-2xl font-semibold text-foreground">
                ₦{listing.price.toLocaleString("en-NG")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Date & time picker ─────────────────────── */}
      <section className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6 rounded-[28px] border border-border bg-card p-5 md:p-8">
          {/* Calendar */}
          <div>
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-xl bg-secondary text-primary">
                <Calendar className="size-5" />
              </span>
              <div>
                <h2 className="font-heading text-xl font-semibold">
                  Pick a date
                </h2>
                <p className="text-sm text-muted-foreground">
                  Choose from the next 14 days.
                </p>
              </div>
            </div>
            <div className="mt-5 flex gap-2 overflow-x-auto pb-2 scrollbar-none">
              {calendarDays.map((day, index) => (
                <motion.button
                  key={day.label}
                  type="button"
                  whileTap={{ scale: 0.93 }}
                  onClick={() => {
                    setSelectedDate(index);
                    setSelectedSlot(null);
                  }}
                  className={`flex shrink-0 flex-col items-center gap-1 rounded-xl border px-3 py-2.5 text-center transition-colors ${
                    selectedDate === index
                      ? "border-primary bg-secondary text-primary"
                      : "border-border hover:border-primary/40"
                  }`}
                >
                  <span className="text-[11px] font-medium text-muted-foreground">
                    {day.dayName}
                  </span>
                  <span className="text-sm font-semibold">{day.label}</span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Time slots */}
          <div>
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-xl bg-secondary text-primary">
                <Clock className="size-5" />
              </span>
              <div>
                <h2 className="font-heading text-xl font-semibold">
                  Pick a time
                </h2>
                <p className="text-sm text-muted-foreground">
                  Available slots for{" "}
                  {calendarDays[selectedDate]?.label ?? "today"}.
                </p>
              </div>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
              {availableSlotsForDate.map((slot) => (
                <motion.button
                  key={slot}
                  type="button"
                  whileTap={{ scale: 0.93 }}
                  onClick={() => setSelectedSlot(slot)}
                  className={`rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors ${
                    selectedSlot === slot
                      ? "border-primary bg-secondary text-primary"
                      : "border-border hover:border-primary/40"
                  }`}
                >
                  {slot}
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Price breakdown sidebar ─────────────── */}
        <aside className="order-first flex flex-col justify-between rounded-[28px] bg-[#0b1f3a] p-5 text-white shadow-[0_20px_50px_rgba(11,31,58,0.18)] md:p-8 lg:order-none lg:sticky lg:top-24">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-blue-100/65">
              Booking summary
            </p>
            <p className="mt-3 font-heading text-3xl font-semibold">
              ₦{total.toLocaleString("en-NG")}
            </p>
            <p className="mt-2 text-sm text-blue-100/65">
              {listing.name} ·{" "}
              {selectedSlot
                ? `${calendarDays[selectedDate]?.label} at ${selectedSlot}`
                : "Select date & time"}
            </p>
          </div>

          <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-3">
            <div className="flex items-center justify-between text-sm text-blue-100/80">
              <span>Service</span>
              <span className="font-medium text-white">{listing.name}</span>
            </div>
            <div className="mt-2 flex items-center justify-between text-sm text-blue-100/80">
              <span>Date</span>
              <span className="font-medium text-white">
                {calendarDays[selectedDate]?.label ?? "—"}
              </span>
            </div>
            <div className="mt-2 flex items-center justify-between text-sm text-blue-100/80">
              <span>Time</span>
              <span className="font-medium text-white">
                {selectedSlot ?? "—"}
              </span>
            </div>
          </div>

          {/* Fee accordion */}
          <div className="mt-5 border-y border-white/10 py-3">
            <button
              type="button"
              onClick={() => setFeeOpen((open) => !open)}
              className="flex w-full items-center justify-between text-sm text-blue-100/80"
            >
              <span>Fee breakdown</span>
              <ChevronDown
                className={`size-4 transition-transform ${feeOpen ? "rotate-180" : ""}`}
              />
            </button>
            <AnimatePresence initial={false}>
              {feeOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="space-y-2 pt-4 text-sm">
                    <div className="flex justify-between text-blue-100/65">
                      <span>Service fee</span>
                      <span>₦{SERVICE_FEE.toLocaleString("en-NG")}</span>
                    </div>
                    <div className="flex justify-between text-blue-100/65">
                      <span>Booking fee</span>
                      <span>₦{BOOKING_FEE.toLocaleString("en-NG")}</span>
                    </div>
                    <div className="flex justify-between text-blue-100/65">
                      <span>Service price</span>
                      <span>
                        ₦{listing.price.toLocaleString("en-NG")}
                      </span>
                    </div>
                    <div className="flex justify-between border-t border-white/10 pt-2 font-semibold">
                      <span>Total</span>
                      <span>₦{total.toLocaleString("en-NG")}</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Button
            type="button"
            size="lg"
            onClick={confirmBooking}
            disabled={!selectedSlot || pinOpen}
            className="mt-6 h-12 w-full rounded-2xl bg-accent text-white hover:bg-accent/90"
          >
            Confirm Booking
          </Button>
        </aside>
      </section>

      <PinModal
        open={pinOpen}
        onOpenChange={setPinOpen}
        onSuccess={() =>
          toast.success("Booking confirmed", {
            description: `Mock booking at ${listing.name} on ${calendarDays[selectedDate]?.label} at ${selectedSlot}.`,
          })
        }
        title="Confirm booking"
        amount={`₦${total.toLocaleString("en-NG")}`}
      />
    </div>
  );
}
