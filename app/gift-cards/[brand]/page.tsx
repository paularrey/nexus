"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ChevronDown,
  CreditCard,
  WalletCards,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { use, useMemo, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { PinModal } from "@/components/PinModal";
import { useAuthGate } from "@/hooks/useAuthGate";
import { dashboardData } from "@/lib/mock-data/dashboard";
import { getBrandBySlug } from "@/lib/mock-data/gift-card-catalog";

const SERVICE_FEE_PERCENT = 0.02;

const formatPrice = (value: number) =>
  new Intl.NumberFormat("en-NG", {
    maximumFractionDigits: 0,
  }).format(value);

export default function GiftCardBrandPage({
  params,
}: {
  params: Promise<{ brand: string }>;
}) {
  const { brand: slug } = use(params);
  const brand = getBrandBySlug(slug);

  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("");
  const [useCustom, setUseCustom] = useState(false);
  const [feeOpen, setFeeOpen] = useState(false);
  const [pinOpen, setPinOpen] = useState(false);
  const authGate = useAuthGate();

  const activeAmount = useCustom
    ? Number(customAmount) || 0
    : selectedAmount ?? 0;

  const priceBreakdown = useMemo(() => {
    const serviceFee = activeAmount * SERVICE_FEE_PERCENT;
    const total = activeAmount + serviceFee;
    const hasEnough = dashboardData.balance >= total;
    return { serviceFee, total, hasEnough };
  }, [activeAmount]);

  const confirmPurchase = () => {
    if (!priceBreakdown.hasEnough) return;
    authGate(() => setPinOpen(true));
  };

  if (!brand) {
    return (
      <div className="mx-auto w-full max-w-5xl space-y-8">
        <Link
          href="/gift-cards"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" /> Back to gift cards
        </Link>
        <div className="rounded-[28px] border border-dashed border-border bg-card p-12 text-center">
          <p className="text-lg font-semibold text-muted-foreground">
            Brand not found
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            This gift card brand isn&apos;t available yet.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-5xl space-y-8">
      <Link
        href="/gift-cards"
        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Back to gift cards
      </Link>

      <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        {/* ── Left: Brand + Denomination ──────────── */}
        <div className="space-y-6">
          {/* Brand header */}
          <section className="overflow-hidden rounded-[28px] border border-border bg-card">
            <div className="relative aspect-[21/6] bg-muted">
              <Image
                src={brand.image}
                alt={`${brand.name} gift card`}
                fill
                className="object-contain p-6"
                sizes="(max-width: 1024px) 100vw, 60vw"
                priority
              />
            </div>
            <div className="p-5 md:p-7">
              <span className="inline-block rounded-lg bg-secondary px-2.5 py-1 text-xs font-semibold text-primary">
                {brand.category}
              </span>
              <h1 className="mt-3 font-heading text-2xl font-semibold tracking-tight md:text-3xl">
                {brand.name} Gift Card
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Select an amount and pay from your Nexus balance. The gift card
                code is delivered instantly.
              </p>
            </div>
          </section>

          {/* Denomination picker */}
          <section className="rounded-[28px] border border-border bg-card p-5 md:p-7">
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-xl bg-secondary text-primary">
                <CreditCard className="size-5" />
              </span>
              <div>
                <h2 className="font-heading text-xl font-semibold">
                  Choose an amount
                </h2>
                <p className="text-sm text-muted-foreground">
                  Pick a preset or enter a custom value.
                </p>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {brand.denominations.map((amount) => {
                const isSelected = selectedAmount === amount && !useCustom;
                return (
                  <motion.button
                    key={amount}
                    type="button"
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setSelectedAmount(amount);
                      setUseCustom(false);
                      setCustomAmount("");
                    }}
                    className={`rounded-2xl border px-4 py-4 text-center transition-colors ${
                      isSelected
                        ? "border-primary bg-secondary text-primary"
                        : "border-border hover:border-primary/40"
                    }`}
                    aria-pressed={isSelected}
                  >
                    <span className="block font-heading text-xl font-semibold">
                      ₦{formatPrice(amount)}
                    </span>
                  </motion.button>
                );
              })}
            </div>

            <div className="mt-4">
              <button
                type="button"
                onClick={() => setUseCustom(true)}
                className={`w-full rounded-2xl border px-4 py-3 text-left text-sm font-medium transition-colors ${
                  useCustom
                    ? "border-primary bg-secondary text-primary"
                    : "border-border text-muted-foreground hover:border-primary/40"
                }`}
              >
                Enter custom amount
              </button>
              <AnimatePresence>
                {useCustom && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <span className="relative mt-3 block">
                      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        ₦
                      </span>
                      <input
                        type="number"
                        min="1000"
                        value={customAmount}
                        onChange={(event) =>
                          setCustomAmount(event.target.value)
                        }
                        placeholder="Enter amount"
                        className="h-12 w-full rounded-xl border border-input bg-background pl-8 pr-3 text-lg font-semibold outline-none focus:border-primary focus:ring-3 focus:ring-primary/15"
                      />
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </section>
        </div>

        {/* ── Right: Summary + Confirm ─────────────── */}
        <aside className="order-first flex flex-col justify-between rounded-[28px] bg-card p-5 shadow-[0_4px_24px_rgba(224,122,95,0.08)] ring-1 ring-border md:p-7 lg:order-none lg:sticky lg:top-24">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
              Order summary
            </p>
            <h2 className="mt-2 font-heading text-2xl font-semibold">
              {brand.name} Gift Card
            </h2>
          </div>

          <div className="mt-5 rounded-[22px] border border-border bg-muted/35 p-4">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Amount</span>
              <span className="font-medium text-foreground">
                {activeAmount > 0
                  ? `₦${formatPrice(activeAmount)}`
                  : "—"}
              </span>
            </div>
            <div className="mt-2 flex items-center justify-between text-sm text-muted-foreground">
              <span>Service fee (2%)</span>
              <span className="font-medium text-foreground">
                {activeAmount > 0
                  ? `₦${formatPrice(priceBreakdown.serviceFee)}`
                  : "—"}
              </span>
            </div>
            <div className="mt-3 border-t border-border pt-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Total</span>
                <span className="font-heading text-2xl font-semibold">
                  {activeAmount > 0
                    ? `₦${formatPrice(priceBreakdown.total)}`
                    : "—"}
                </span>
              </div>
            </div>
          </div>

          {/* Wallet balance */}
          <div className="mt-5 flex items-center gap-3 rounded-2xl border border-border bg-card p-3">
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-secondary text-primary">
              <WalletCards className="size-5" />
            </span>
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">Wallet balance</p>
              <p className="font-heading text-lg font-semibold">
                ₦{formatPrice(dashboardData.balance)}
              </p>
            </div>
          </div>

          {/* Insufficient funds warning */}
          {activeAmount > 0 && !priceBreakdown.hasEnough && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 rounded-2xl border border-danger/20 bg-danger/5 p-4 text-sm text-danger"
            >
              Insufficient balance. You need ₦
              {formatPrice(priceBreakdown.total - dashboardData.balance)} more
              to complete this purchase.
            </motion.div>
          )}

          {/* Fee breakdown */}
          <button
            type="button"
            onClick={() => setFeeOpen((open) => !open)}
            className="mt-5 flex w-full items-center justify-between text-sm text-muted-foreground"
          >
            <span>Price breakdown</span>
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
                <div className="space-y-2 border-t border-border pt-3 text-sm">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Gift card value</span>
                    <span>₦{formatPrice(activeAmount)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Service fee (2%)</span>
                    <span>₦{formatPrice(priceBreakdown.serviceFee)}</span>
                  </div>
                  <div className="flex justify-between border-t border-border pt-2 font-semibold">
                    <span>Total</span>
                    <span>₦{formatPrice(priceBreakdown.total)}</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <Button
            type="button"
            size="lg"
            onClick={confirmPurchase}
            disabled={!activeAmount || !priceBreakdown.hasEnough || pinOpen}
            className="mt-6 h-12 w-full"
          >
            Buy {brand.name} Gift Card
          </Button>
        </aside>
      </div>

      <PinModal
        open={pinOpen}
        onOpenChange={setPinOpen}
        onSuccess={() =>
          toast.success(`${brand.name} gift card purchased`, {
            description: `₦${formatPrice(activeAmount)} ${brand.name} gift card delivered to your wallet.`,
          })
        }
        title={`Buy ${brand.name} gift card`}
        amount={`₦${formatPrice(priceBreakdown.total)}`}
      />
    </div>
  );
}
