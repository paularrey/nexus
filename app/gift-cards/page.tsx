"use client";

import { motion } from "framer-motion";
import {
  Check,
  ChevronDown,
  Clock,
  CreditCard,
  ShieldCheck,
  Upload,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { PinModal } from "@/components/PinModal";
import { useAuthGate } from "@/hooks/useAuthGate";
import { getExchangeRate } from "@/lib/mock-data/exchange-rates";
import { giftCardBrandOptions } from "@/lib/mock-data/gift-card-brands";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-NG", {
    maximumFractionDigits: 0,
  }).format(value);

export default function GiftCardsPage() {
  const [selectedBrandId, setSelectedBrandId] = useState("us-amazon");
  const [cardAmount, setCardAmount] = useState(100);
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState("");
  const [feeOpen, setFeeOpen] = useState(false);
  const [pinOpen, setPinOpen] = useState(false);
  const authGate = useAuthGate();

  const selectedBrand =
    giftCardBrandOptions.find((b) => b.id === selectedBrandId) ??
    giftCardBrandOptions[0];

  const exchangeInfo = useMemo(() => {
    const conversion = getExchangeRate(selectedBrand.currency ?? "USD", "NGN");
    const grossValue = cardAmount * conversion.rate;
    const serviceFee = grossValue * conversion.feePercent;
    const finalPayout = grossValue - serviceFee;

    return { conversion, grossValue, serviceFee, finalPayout };
  }, [cardAmount, selectedBrand]);

  const submitCard = () => {
    authGate(() => setPinOpen(true));
  };

  return (
    <div className="mx-auto w-full max-w-5xl space-y-8">
      <header>
        <p className="text-sm font-medium text-primary">Gift cards</p>
        <h1 className="mt-1 font-heading text-3xl font-semibold tracking-tight md:text-4xl">
          Sell your gift card
        </h1>
        <p className="mt-2 max-w-xl text-muted-foreground">
          Get instant Naira for your unused gift cards. Pick a brand, enter the
          value, and see your payout before you submit.
        </p>
      </header>

      <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        {/* ── Left: Form ─────────────────────────────── */}
        <div className="space-y-6">
          {/* Step 1: Pick a brand */}
          <section className="rounded-[28px] border border-border bg-card p-5 md:p-7">
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-xl bg-secondary text-primary">
                <CreditCard className="size-5" />
              </span>
              <div>
                <p className="text-xs font-medium text-muted-foreground">
                  Step 1
                </p>
                <h2 className="font-heading text-xl font-semibold">
                  Pick a brand
                </h2>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {giftCardBrandOptions.map((brand) => {
                const isSelected = selectedBrandId === brand.id;
                return (
                  <motion.button
                    key={brand.id}
                    type="button"
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedBrandId(brand.id)}
                    className={`relative flex flex-col items-start gap-3 rounded-2xl border p-4 text-left transition-shadow ${
                      isSelected
                        ? "border-primary bg-secondary shadow-sm"
                        : "border-border hover:border-primary/35"
                    }`}
                    aria-pressed={isSelected}
                  >
                    <span
                      className="grid size-10 place-items-center rounded-xl text-sm font-bold text-white"
                      style={{ backgroundColor: brand.color }}
                    >
                      {brand.name.slice(0, 2).toUpperCase()}
                    </span>
                    <div>
                      <span className="block text-sm font-semibold">
                        {brand.name}
                      </span>
                      <span className="mt-0.5 block text-xs text-muted-foreground">
                        {brand.category}
                      </span>
                    </div>
                    {isSelected && (
                      <Check className="absolute right-3 top-3 size-4 text-primary" />
                    )}
                  </motion.button>
                );
              })}
            </div>
          </section>

          {/* Step 2: Enter card value */}
          <section className="rounded-[28px] border border-border bg-card p-5 md:p-7">
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-xl bg-secondary text-primary">
                <span className="text-lg font-bold">$</span>
              </span>
              <div>
                <p className="text-xs font-medium text-muted-foreground">
                  Step 2
                </p>
                <h2 className="font-heading text-xl font-semibold">
                  Enter card value
                </h2>
              </div>
            </div>

            <div className="mt-5">
              <label
                className="block text-sm font-medium"
                htmlFor="card-amount"
              >
                Card face value (USD)
              </label>
              <span className="relative mt-2 block">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  $
                </span>
                <input
                  id="card-amount"
                  type="number"
                  min="1"
                  value={cardAmount}
                  onChange={(event) =>
                    setCardAmount(Number(event.target.value) || 0)
                  }
                  className="h-12 w-full rounded-xl border border-input bg-background pl-8 pr-3 text-lg font-semibold outline-none focus:border-primary focus:ring-3 focus:ring-primary/15"
                />
              </span>
              <div className="mt-3 flex flex-wrap gap-2">
                {[25, 50, 100, 200, 500].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setCardAmount(preset)}
                    className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
                      cardAmount === preset
                        ? "border-primary bg-secondary text-primary"
                        : "border-border text-muted-foreground hover:border-primary/40"
                    }`}
                  >
                    ${preset}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Step 3: Upload card */}
          <section className="rounded-[28px] border border-border bg-card p-5 md:p-7">
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-xl bg-secondary text-primary">
                <Upload className="size-5" />
              </span>
              <div>
                <p className="text-xs font-medium text-muted-foreground">
                  Step 3
                </p>
                <h2 className="font-heading text-xl font-semibold">
                  Upload your card
                </h2>
              </div>
            </div>

            <div
              onDragOver={(event) => {
                event.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(event) => {
                event.preventDefault();
                setIsDragging(false);
                setFileName(event.dataTransfer.files[0]?.name ?? "");
              }}
              className={`mt-5 rounded-[22px] border-2 border-dashed p-5 transition-colors ${
                isDragging
                  ? "border-primary bg-secondary/70"
                  : "border-border bg-muted/35"
              }`}
            >
              <label className="flex min-h-28 cursor-pointer flex-col items-center justify-center text-center">
                <Upload className="size-7 text-muted-foreground" />
                <span className="mt-3 text-sm font-medium">
                  {fileName || "Drop card image or tap to browse"}
                </span>
                <span className="mt-1 text-xs text-muted-foreground">
                  Screenshot, receipt, or photo of the card
                </span>
                <input
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={(event) =>
                    setFileName(event.target.files?.[0]?.name ?? "")
                  }
                />
              </label>
            </div>
          </section>
        </div>

        {/* ── Right: Payout summary ──────────────────── */}
        <aside className="rounded-[28px] border border-border bg-card p-5 shadow-[0_4px_24px_rgba(224,122,95,0.08)] ring-1 ring-border md:p-7 lg:sticky lg:top-24">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
            Payout summary
          </p>
          <h2 className="mt-2 font-heading text-2xl font-semibold">
            You receive
          </h2>

          <motion.div
            key={`${selectedBrandId}-${cardAmount}`}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 rounded-[22px] border border-border bg-muted/35 p-4"
          >
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Estimated payout</span>
              <span className="text-xs font-medium text-success">Live rate</span>
            </div>
            <p className="mt-2 font-heading text-4xl font-semibold text-success">
              ₦{formatCurrency(exchangeInfo.finalPayout)}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              for ${cardAmount} {selectedBrand.name} card
            </p>
          </motion.div>

          <div className="mt-5 space-y-3 rounded-[22px] border border-border bg-card p-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Brand</span>
              <span className="font-medium">{selectedBrand.name}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Card value</span>
              <span className="font-medium">${cardAmount}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Exchange rate</span>
              <span className="font-medium">
                1 USD = ₦{exchangeInfo.conversion.rate.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Service fee</span>
              <span className="font-medium">
                ₦{formatCurrency(exchangeInfo.serviceFee)}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setFeeOpen((open) => !open)}
            className="mt-4 flex w-full items-center justify-between text-sm text-muted-foreground"
          >
            <span>Rate breakdown</span>
            <ChevronDown
              className={`size-4 transition-transform ${feeOpen ? "rotate-180" : ""}`}
            />
          </button>
          {feeOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              className="overflow-hidden"
            >
              <div className="space-y-2 border-t border-border pt-3 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Face value</span>
                  <span>${cardAmount}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Rate applied</span>
                  <span>
                    {exchangeInfo.conversion.rate.toLocaleString()} NGN/USD
                  </span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Service fee ({(exchangeInfo.conversion.feePercent * 100).toFixed(0)}%)</span>
                  <span>₦{formatCurrency(exchangeInfo.serviceFee)}</span>
                </div>
                <div className="flex justify-between border-t border-border pt-2 font-semibold">
                  <span>You receive</span>
                  <span>₦{formatCurrency(exchangeInfo.finalPayout)}</span>
                </div>
              </div>
            </motion.div>
          )}

          <Button
            type="button"
            onClick={submitCard}
            disabled={!cardAmount || !fileName || pinOpen}
            className="mt-6 h-12 w-full"
          >
            Sell now
          </Button>

          <div className="mt-4 flex items-center gap-2 rounded-xl border border-border bg-muted/35 p-3 text-xs text-muted-foreground">
            <Clock className="size-3.5" />
            <span>Payout usually arrives within 5–10 minutes</span>
          </div>

          <div className="mt-2 flex items-center gap-2 rounded-xl border border-border bg-muted/35 p-3 text-xs text-muted-foreground">
            <ShieldCheck className="size-3.5 text-primary" />
            <span>Card is verified before payout is released</span>
          </div>
        </aside>
      </div>

      <PinModal
        open={pinOpen}
        onOpenChange={setPinOpen}
        onSuccess={() =>
          toast.success("Gift card submitted", {
            description: `Mock ${selectedBrand.name} card ($${cardAmount}) submitted for verification.`,
          })
        }
        title="Confirm gift card sale"
        amount={`₦${formatCurrency(exchangeInfo.finalPayout)}`}
      />
    </div>
  );
}
