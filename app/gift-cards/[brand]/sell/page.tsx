"use client";

import { motion } from "framer-motion";
import {
  ArrowLeft,
  Check,
  CreditCard,
  FileImage,
  Upload,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { use, useMemo, useState } from "react";
import { toast } from "sonner";

import { PinModal } from "@/components/payments/PinModal";
import { Button } from "@/components/ui/Button";
import { FeeBreakdown } from "@/components/ui/FeeBreakdown";
import { useAuthGate } from "@/lib/hooks/useAuthGate";
import { getBrandBySlug } from "@/lib/mock-data/gift-card-catalog";
import { formatAmount } from "@/lib/utils/format";
import type { BrandPageProps, CardType } from "@/types";

// TODO: Connect to real exchange rate data
const MOCK_RATE = 950;
const SERVICE_FEE_PERCENT = 0.02;

const cardTypes: { value: CardType; label: string; description: string }[] = [
  {
    value: "physical",
    label: "Physical card",
    description: "A tangible card you purchased in-store",
  },
  {
    value: "ecode",
    label: "E-code",
    description: "A digital code delivered via email or SMS",
  },
];

export default function GiftCardSellPage({ params }: BrandPageProps) {
  const { brand: slug } = use(params);
  const brand = getBrandBySlug(slug);

  const [cardType, setCardType] = useState<CardType>("physical");
  const [faceValue, setFaceValue] = useState<number | null>(null);
  const [customValue, setCustomValue] = useState("");
  const [useCustom, setUseCustom] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState("");
  const [pinOpen, setPinOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [referenceId] = useState(
    () => `NX-GC-${Date.now().toString(36).toUpperCase()}`,
  );
  const authGate = useAuthGate();

  const activeValue = useCustom ? Number(customValue) || 0 : faceValue ?? 0;

  const payout = useMemo(() => {
    const gross = activeValue * MOCK_RATE;
    const fee = gross * SERVICE_FEE_PERCENT;
    const net = gross - fee;
    return { gross, fee, net };
  }, [activeValue]);

  const confirmSubmission = () => {
    if (!activeValue || !fileName) return;
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
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="mx-auto w-full max-w-lg space-y-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-[28px] border border-border bg-card p-8 text-center"
        >
          <div className="mx-auto grid size-16 place-items-center rounded-full bg-success/10">
            <Check className="size-8 text-success" />
          </div>
          <h1 className="mt-5 font-heading text-2xl font-semibold">
            Submitted for review
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            We&apos;ll verify your {brand.name} card and credit your wallet
            within 24 hours.
          </p>

          <div className="mt-6 rounded-[22px] border border-border bg-muted/35 p-4 text-left">
            <div className="flex items-center gap-3">
              <span className="relative size-10 shrink-0 overflow-hidden rounded-full bg-muted">
                <Image
                  src={brand.image}
                  alt={brand.name}
                  fill
                  className="object-cover"
                  sizes="40px"
                />
              </span>
              <div>
                <p className="font-semibold">{brand.name} Gift Card</p>
                <p className="text-xs text-muted-foreground">
                  {cardType === "physical" ? "Physical card" : "E-code"} · ₦
                  {formatAmount(activeValue)} face value
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 rounded-[22px] border border-border bg-card p-4">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Reference ID</span>
                <span className="font-mono font-medium">
                  {referenceId}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Expected payout</span>
                <span className="font-semibold text-success">
                  ₦{formatAmount(payout.net)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status</span>
                <span className="rounded-full bg-warning/10 px-2 py-0.5 text-xs font-semibold text-warning">
                  Pending review
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button asChild variant="outline" className="flex-1">
              <Link href="/gift-cards">Sell another card</Link>
            </Button>
            <Button asChild className="flex-1">
              <Link href="/">Back to home</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">
      <Link
        href="/gift-cards"
        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Back to gift cards
      </Link>

      <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
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
              <h1 className="font-heading text-2xl font-semibold tracking-tight md:text-3xl">
                Sell {brand.name} Gift Card
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Enter your card details below. We&apos;ll verify it and credit
                your wallet.
              </p>
            </div>
          </section>

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
                  Card type
                </h2>
              </div>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3">
              {cardTypes.map((type) => {
                const isSelected = cardType === type.value;
                return (
                  <motion.button
                    key={type.value}
                    type="button"
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setCardType(type.value)}
                    className={`relative rounded-2xl border p-4 text-left transition-colors ${
                      isSelected
                        ? "border-primary bg-secondary"
                        : "border-border hover:border-primary/35"
                    }`}
                    aria-pressed={isSelected}
                  >
                    <span className="block text-sm font-semibold">
                      {type.label}
                    </span>
                    <span className="mt-1 block text-xs text-muted-foreground">
                      {type.description}
                    </span>
                    {isSelected && (
                      <Check className="absolute right-3 top-3 size-4 text-primary" />
                    )}
                  </motion.button>
                );
              })}
            </div>
          </section>

          <section className="rounded-[28px] border border-border bg-card p-5 md:p-7">
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-xl bg-secondary text-primary">
                <span className="text-lg font-bold">₦</span>
              </span>
              <div>
                <p className="text-xs font-medium text-muted-foreground">
                  Step 2
                </p>
                <h2 className="font-heading text-xl font-semibold">
                  Card face value
                </h2>
              </div>
            </div>
            <div className="mt-5">
              <label
                className="block text-sm font-medium"
                htmlFor="face-value"
              >
                How much is the card worth? (USD)
              </label>
              <span className="relative mt-2 block">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  $
                </span>
                <input
                  id="face-value"
                  type="number"
                  min="1"
                  value={useCustom ? customValue : faceValue ?? ""}
                  onChange={(event) => {
                    setUseCustom(true);
                    setCustomValue(event.target.value);
                  }}
                  placeholder="Enter amount"
                  className="h-12 w-full rounded-xl border border-input bg-background pl-8 pr-3 text-lg font-semibold outline-none focus:border-primary focus:ring-3 focus:ring-primary/15"
                />
              </span>
              <div className="mt-3 flex flex-wrap gap-2">
                {[25, 50, 100, 200, 500].map((preset) => {
                  const isSelected = faceValue === preset && !useCustom;
                  return (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => {
                        setFaceValue(preset);
                        setUseCustom(false);
                        setCustomValue("");
                      }}
                      className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
                        isSelected
                          ? "border-primary bg-secondary text-primary"
                          : "border-border text-muted-foreground hover:border-primary/40"
                      }`}
                    >
                      ${preset}
                    </button>
                  );
                })}
              </div>
            </div>
          </section>

          <section className="rounded-[28px] border border-border bg-card p-5 md:p-7">
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-xl bg-secondary text-primary">
                <FileImage className="size-5" />
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
                  Photo of front/back, or code screenshot
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

        <aside className="order-first flex flex-col justify-between rounded-[28px] bg-card p-5 shadow-[0_4px_24px_rgba(43,33,28,0.06)] ring-1 ring-border md:p-7 lg:order-none lg:sticky lg:top-24">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
              Payout summary
            </p>
            <h2 className="mt-2 font-heading text-2xl font-semibold">
              You receive
            </h2>
          </div>

          <motion.div
            key={`${slug}-${activeValue}`}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 rounded-[22px] border border-border bg-muted/35 p-5"
          >
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Estimated payout</span>
              <span className="text-xs font-medium text-success">
                ₦{MOCK_RATE}/$1
              </span>
            </div>
            <p className="mt-2 font-heading text-4xl font-semibold text-success">
              {activeValue > 0 ? `₦${formatAmount(payout.net)}` : "—"}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {activeValue > 0
                ? `for $${activeValue} ${brand.name} card`
                : "Enter card value to see payout"}
            </p>
          </motion.div>

          <div className="mt-5 space-y-3 rounded-[22px] border border-border bg-card p-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Brand</span>
              <span className="font-medium">{brand.name}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Card type</span>
              <span className="font-medium capitalize">{cardType}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Face value</span>
              <span className="font-medium">
                {activeValue > 0 ? `$${activeValue}` : "—"}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Sell rate</span>
              <span className="font-medium">₦{MOCK_RATE}/$1</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Service fee</span>
              <span className="font-medium">
                {activeValue > 0 ? `₦${formatAmount(payout.fee)}` : "—"}
              </span>
            </div>
          </div>

          <div className="mt-4">
            <FeeBreakdown
              label="Rate breakdown"
              className="mt-0"
              contentClassName="space-y-2 border-t border-border pt-3 text-sm"
              rows={[
                {
                  label: "Face value",
                  value: activeValue > 0 ? `$${activeValue}` : "—",
                },
                {
                  label: "Rate applied",
                  value: `₦${MOCK_RATE}/$1`,
                },
                {
                  label: "Service fee (2%)",
                  value:
                    activeValue > 0 ? `₦${formatAmount(payout.fee)}` : "—",
                },
                {
                  label: "You receive",
                  value:
                    activeValue > 0 ? `₦${formatAmount(payout.net)}` : "—",
                  emphasis: "strong-bordered",
                  valueClassName: "text-success",
                },
              ]}
            />
          </div>

          <Button
            type="button"
            size="lg"
            onClick={confirmSubmission}
            disabled={!activeValue || !fileName || pinOpen}
            className="mt-6 h-12 w-full"
          >
            Submit for review
          </Button>

          <p className="mt-3 text-center text-xs text-muted-foreground">
            Cards are reviewed within 24 hours before payout.
          </p>
        </aside>
      </div>

      <PinModal
        open={pinOpen}
        onOpenChange={setPinOpen}
        onSuccess={() => {
          toast.success("Card submitted", {
            description: `Your ${brand.name} card ($${activeValue}) is now under review.`,
          });
          setSubmitted(true);
        }}
        title={`Sell ${brand.name} gift card`}
        amount={`₦${formatAmount(payout.net)}`}
      />
    </div>
  );
}
