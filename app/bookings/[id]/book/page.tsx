"use client";

import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, Star } from "lucide-react";
import { use, useMemo, useState } from "react";
import { toast } from "sonner";

import { PinModal } from "@/components/payments/PinModal";
import { BackLink } from "@/components/ui/BackLink";
import { Button } from "@/components/ui/Button";
import { CardSection } from "@/components/ui/CardSection";
import { EmptyState } from "@/components/ui/EmptyState";
import { FeeBreakdown } from "@/components/ui/FeeBreakdown";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { usePinFlow } from "@/lib/hooks/usePinFlow";
import { marketplaceListings } from "@/lib/mock-data/marketplace";
import { formatNaira } from "@/lib/utils/format";
import type { BookingPageProps, CalendarDay } from "@/types";

const SERVICE_FEE = 500;
const BOOKING_FEE = 200;

const generateCalendarDays = () => {
  const today = new Date();
  const days: CalendarDay[] = [];
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

export default function BookingReviewPage({ params }: BookingPageProps) {
  const { id } = use(params);
  const listing = marketplaceListings.find((l) => l.id === id);

  const [selectedDate, setSelectedDate] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const { pinOpen, setPinOpen, openPin } = usePinFlow();

  const calendarDays = useMemo(() => generateCalendarDays(), []);

  const total = listing ? listing.price + SERVICE_FEE + BOOKING_FEE : 0;

  const availableSlotsForDate = useMemo(() => {
    if (!listing) return [];
    const day = calendarDays[selectedDate];
    if (!day) return listing.availableSlots;
    const dayAbbr = day.dayName.slice(0, 3);
    const matched = listing.availableSlots.filter((slot) =>
      slot.startsWith(dayAbbr),
    );
    return matched.length > 0 ? matched : listing.availableSlots;
  }, [selectedDate, calendarDays, listing]);

  if (!listing) {
    return (
      <div className="mx-auto w-full max-w-5xl space-y-8">
        <BackLink href="/bookings">Back to bookings</BackLink>
        <EmptyState
          title="Service not found"
          description="This listing may have been removed."
        />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-5xl space-y-8">
      <BackLink href="/bookings">Back to bookings</BackLink>

      <section className="overflow-hidden rounded-[28px] border border-border bg-card">
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
                {formatNaira(listing.price)}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <CardSection className="space-y-6">
          <div>
            <SectionHeader
              icon={Calendar}
              title="Pick a date"
              description="Choose from the next 14 days."
            />
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

          <div>
            <SectionHeader
              icon={Clock}
              title="Pick a time"
              description={`Available slots for ${
                calendarDays[selectedDate]?.label ?? "today"
              }.`}
            />
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
        </CardSection>

        <aside className="order-first flex flex-col justify-between rounded-[28px] bg-card p-5 shadow-[0_4px_24px_rgb(46_46_58_/_0.05)] ring-1 ring-border md:p-8 lg:order-none lg:sticky lg:top-24">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
              Booking summary
            </p>
            <p className="mt-3 font-heading text-3xl font-semibold">
              {formatNaira(total)}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              {listing.name} ·{" "}
              {selectedSlot
                ? `${calendarDays[selectedDate]?.label} at ${selectedSlot}`
                : "Select date & time"}
            </p>
          </div>

          <div className="mt-5 rounded-2xl border border-border bg-muted/35 p-3">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Service</span>
              <span className="font-medium text-foreground">
                {listing.name}
              </span>
            </div>
            <div className="mt-2 flex items-center justify-between text-sm text-muted-foreground">
              <span>Date</span>
              <span className="font-medium text-foreground">
                {calendarDays[selectedDate]?.label ?? "—"}
              </span>
            </div>
            <div className="mt-2 flex items-center justify-between text-sm text-muted-foreground">
              <span>Time</span>
              <span className="font-medium text-foreground">
                {selectedSlot ?? "—"}
              </span>
            </div>
          </div>

          <div className="mt-5 border-y border-border py-3">
            <FeeBreakdown
              rows={[
                {
                  label: "Service fee",
                  value: formatNaira(SERVICE_FEE),
                },
                {
                  label: "Booking fee",
                  value: formatNaira(BOOKING_FEE),
                },
                {
                  label: "Service price",
                  value: formatNaira(listing.price),
                },
                {
                  label: "Total",
                  value: formatNaira(total),
                  emphasis: "strong-bordered",
                },
              ]}
            />
          </div>

          <Button
            type="button"
            size="lg"
            onClick={openPin}
            disabled={!selectedSlot || pinOpen}
            className="mt-6 h-12 w-full rounded-full"
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
        amount={formatNaira(total)}
      />
    </div>
  );
}
