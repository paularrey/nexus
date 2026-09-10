"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  CreditCard,
  Gift,
  ReceiptText,
  Smartphone,
  Zap,
} from "lucide-react";
import { useCallback, useState } from "react";

import { Button } from "@/components/ui/button";

const ONBOARDING_KEY = "ravecard-onboarding-seen";

const steps = [
  {
    icon: Zap,
    title: "Pay for airtime and data",
    description:
      "Top up any mobile network directly from your Ravecard balance. Pick a plan, enter a number, confirm — done.",
    color: "bg-primary/15 text-primary",
  },
  {
    icon: ReceiptText,
    title: "Settle bills without leaving home",
    description:
      "Electricity, internet, cable TV — verify your account, choose an amount, and pay in seconds.",
    color: "bg-emerald-500/15 text-emerald-400",
  },
  {
    icon: Gift,
    title: "Buy or sell gift cards at live rates",
    description:
      "Browse brands, see a real-time conversion, and submit your card for instant payout estimation.",
    color: "bg-primary/15 text-primary",
  },
  {
    icon: BookOpen,
    title: "Book local services you trust",
    description:
      "Find spas, salons, photographers, and home repair providers. Pick a date, choose a time, and confirm your booking.",
    color: "bg-emerald-500/15 text-emerald-400",
  },
  {
    icon: Smartphone,
    title: "Renew subscriptions in one tap",
    description:
      "Netflix, DSTV, Spotify, and more. Select your plan, enter your account number, and renew without hunting for payment pages.",
    color: "bg-primary/15 text-primary",
  },
  {
    icon: CreditCard,
    title: "Your balance is always one glance away",
    description:
      "The home screen shows your available balance, recent activity, and quick access to every service — your freedom, all in one view.",
    color: "bg-primary/10 text-primary",
  },
] as const;

type OnboardingModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function OnboardingModal({ open, onOpenChange }: OnboardingModalProps) {
  const [step, setStep] = useState(0);
  const current = steps[step];
  const isLast = step === steps.length - 1;
  const progress = ((step + 1) / steps.length) * 100;

  const next = useCallback(() => {
    if (isLast) {
      setStep(0);
      onOpenChange(false);
    } else {
      setStep((s) => s + 1);
    }
  }, [isLast, onOpenChange]);

  const skip = useCallback(() => {
    setStep(0);
    onOpenChange(false);
  }, [onOpenChange]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 12 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="relative mx-4 w-full max-w-md overflow-hidden rounded-[28px] border border-border bg-card p-6 shadow-xl"
      >
        {/* Skip button */}
        <button
          type="button"
          onClick={skip}
          className="absolute right-4 top-4 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          Skip
        </button>

        {/* Progress bar */}
        <div className="mb-6 mt-2 h-1 w-full overflow-hidden rounded-full bg-muted">
          <motion.div
            className="h-full rounded-full bg-primary"
            initial={false}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          />
        </div>

        {/* Step content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col items-center text-center"
          >
            <div
              className={`grid size-16 place-items-center rounded-2xl ${current.color}`}
            >
              <current.icon className="size-8" />
            </div>

            <h2 className="mt-5 font-heading text-2xl font-semibold tracking-tight">
              {current.title}
            </h2>
            <p className="mt-3 max-w-sm text-sm leading-6 text-muted-foreground">
              {current.description}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="mt-8 flex items-center justify-between">
          {/* Progress dots */}
          <div className="flex gap-1.5">
            {steps.map((_, index) => (
              <span
                key={index}
                className={`size-2 rounded-full transition-colors ${
                  index === step ? "bg-primary" : "bg-muted"
                }`}
              />
            ))}
          </div>

          <Button
            type="button"
            onClick={next}
            className="gap-2"
          >
            {isLast ? "Get Started" : "Next"}
            {!isLast && <ArrowRight className="size-4" />}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}

export function shouldShowOnboarding(): boolean {
  if (typeof window === "undefined") return false;
  return !window.localStorage.getItem(ONBOARDING_KEY);
}

export function markOnboardingSeen(): void {
  window.localStorage.setItem(ONBOARDING_KEY, "1");
}
