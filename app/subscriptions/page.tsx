"use client";

import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { PinModal } from "@/components/payments/PinModal";
import { AccountStep } from "@/components/subscriptions/AccountStep";
import { ConfirmStep } from "@/components/subscriptions/ConfirmStep";
import {
  PaymentStep,
  type PaymentMethod,
} from "@/components/subscriptions/PaymentStep";
import { PlanStep } from "@/components/subscriptions/PlanStep";
import { StepIndicator } from "@/components/subscriptions/StepIndicator";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/ui/PageHeader";
import { usePinFlow } from "@/lib/hooks/usePinFlow";
import { useMockVerification } from "@/lib/hooks/useMockVerification";
import { dashboardData } from "@/lib/mock-data/dashboard";
import {
  billingDurations,
  subscriptionData,
} from "@/lib/mock-data/subscriptions";
import { formatNaira } from "@/lib/utils/format";
import type { SubscriptionProvider } from "@/types";

type StepKey = "plan" | "account" | "confirm";

const streamingSteps = [
  { key: "plan", label: "Plan" },
  { key: "account", label: "Account" },
  { key: "confirm", label: "Confirm" },
] as const;

const cableSteps = [
  { key: "plan", label: "Bouquet" },
  { key: "account", label: "Verify" },
  { key: "confirm", label: "Confirm" },
] as const;

function isValidEmailOrPhone(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return false;
  if (trimmed.includes("@")) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
  }
  return trimmed.replace(/\D/g, "").length >= 10;
}

function renewalDays(duration: string) {
  return Number.parseInt(duration, 10) || 30;
}

function renewalDateAfter(days: number) {
  const date = new Date(Date.now() + days * 86_400_000);
  return date.toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function SubscriptionsPage() {
  const [stepIndex, setStepIndex] = useState(0);
  const [selectedProvider, setSelectedProvider] = useState<
    SubscriptionProvider
  >(subscriptionData.providers[0]);
  const [planIndex, setPlanIndex] = useState(1);
  const [durationIndex, setDurationIndex] = useState(0);
  const [accountValue, setAccountValue] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(
    "wallet",
  );
  const { pinOpen, setPinOpen, openPin } = usePinFlow();
  const {
    isVerifying,
    isVerified,
    verify,
    reset: resetVerification,
  } = useMockVerification();

  const isCable = selectedProvider.kind === "cable";
  const steps = isCable ? cableSteps : streamingSteps;
  const stepKey: StepKey = steps[Math.min(stepIndex, steps.length - 1)].key;

  const selectedPlan = selectedProvider.plans[planIndex];
  const duration = billingDurations[durationIndex];
  const totalPrice = isCable
    ? Math.round((selectedPlan.price * duration.multiplier) / 50) * 50
    : selectedPlan.price;
  const billingCycle = isCable ? duration.label : selectedPlan.duration;
  const cycleDays = isCable ? duration.months * 30 : renewalDays(selectedPlan.duration);
  const renewalDate = renewalDateAfter(cycleDays);

  const paymentLabel =
    paymentMethod === "wallet"
      ? "Ravecard Wallet"
      : paymentMethod === "card"
        ? `Saved card ···· ${dashboardData.cardNumber.slice(-4)}`
        : "Not selected";

  const accountLabel = isCable ? "Smart card" : "Account";
  const accountDisplay = isCable
    ? accountValue
      ? `${accountValue} · ${subscriptionData.mockAccountName}`
      : ""
    : accountValue.trim();

  const changeProvider = (provider: SubscriptionProvider) => {
    setSelectedProvider(provider);
    setPlanIndex(1);
    setDurationIndex(0);
    setAccountValue("");
    resetVerification();
  };

  const canContinue =
    stepKey === "plan"
      ? true
      : stepKey === "account"
        ? isCable
          ? isVerified
          : isValidEmailOrPhone(accountValue)
        : paymentMethod !== null;

  const primaryLabel =
    stepKey === "confirm"
      ? `Confirm & Pay ${formatNaira(totalPrice)}`
      : "Continue";

  const handlePrimary = () => {
    if (stepKey !== "confirm") {
      setStepIndex((index) => index + 1);
      return;
    }
    // TODO: Connect to real payment processing
    openPin();
  };

  const handleSuccess = () => {
    toast.success("Subscription set up", {
      description: `${selectedProvider.name} ${selectedPlan.name} renews on ${renewalDate}.`,
    });
    setStepIndex(0);
    setPaymentMethod("wallet");
    setAccountValue("");
    resetVerification();
  };

  const handleVerify = () => {
    verify(Boolean(accountValue.trim()), {
      title: "Decoder verified",
      description: `${subscriptionData.mockAccountName} · ${selectedProvider.name}`,
    });
  };

  return (
    <div className="mx-auto w-full max-w-5xl space-y-8">
      <PageHeader
        eyebrow="Subscriptions"
        title="Never miss a renewal."
        lede="Choose a streaming, music, or cable provider and prepare a mock renewal."
        ledeClassName="mt-2 max-w-2xl text-muted-foreground"
      />

      <StepIndicator steps={steps} current={stepIndex} />

      <section className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <motion.div
            key={stepKey + selectedProvider.kind}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="space-y-5"
          >
            {stepKey === "plan" && (
              <PlanStep
                providers={subscriptionData.providers}
                selectedProvider={selectedProvider}
                onProviderChange={changeProvider}
                planIndex={planIndex}
                onPlanChange={setPlanIndex}
                durationIndex={durationIndex}
                onDurationChange={setDurationIndex}
              />
            )}
            {stepKey === "account" && (
              <AccountStep
                provider={selectedProvider}
                value={accountValue}
                onValueChange={setAccountValue}
                isVerifying={isVerifying}
                isVerified={isVerified}
                onVerify={handleVerify}
                onReset={resetVerification}
                accountName={subscriptionData.mockAccountName}
              />
            )}
            {stepKey === "confirm" && (
              <>
                <PaymentStep
                  value={paymentMethod}
                  onChange={setPaymentMethod}
                  amount={totalPrice}
                  walletBalance={dashboardData.balance}
                  cardNumber={dashboardData.cardNumber}
                  cardExpiry={dashboardData.expiry}
                />
                <ConfirmStep
                  provider={selectedProvider}
                  plan={selectedPlan}
                  paymentLabel={paymentLabel}
                  renewalDate={renewalDate}
                  billingCycle={billingCycle}
                  accountLabel={accountLabel}
                  accountValue={accountDisplay}
                  totalPrice={totalPrice}
                />
              </>
            )}
          </motion.div>

          <div className="mt-5 flex items-center justify-between gap-3">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setStepIndex((index) => Math.max(0, index - 1))}
              disabled={stepIndex === 0}
              className="gap-1.5"
            >
              <ArrowLeft /> Back
            </Button>
            <Button
              type="button"
              size="lg"
              onClick={handlePrimary}
              disabled={!canContinue}
              className="h-11 px-6"
            >
              {primaryLabel}
            </Button>
          </div>
        </div>

        <aside className="flex flex-col justify-between rounded-[28px] border border-border bg-surface p-5 text-foreground shadow-[0_4px_24px_color-mix(in_srgb,var(--foreground)_6%,transparent)] md:p-8">
          <div>
            <p className="text-sm text-muted-foreground">Renewal preview</p>
            <p className="mt-3 font-heading text-3xl font-semibold">
              {formatNaira(totalPrice)}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              {selectedProvider.name} · {selectedPlan.name} · {billingCycle}
            </p>
            <dl className="mt-5 space-y-3 border-t border-border pt-4 text-sm">
              <div className="flex items-center justify-between gap-4">
                <dt className="text-muted-foreground">Payment</dt>
                <dd className="font-medium">
                  {paymentMethod ? paymentLabel : "Choose on step 3"}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="text-muted-foreground">Next renewal</dt>
                <dd className="font-medium">{renewalDate}</dd>
              </div>
            </dl>
          </div>
          <p className="mt-6 text-xs text-muted-foreground">
            Mock checkout — no real money moves.
          </p>
        </aside>
      </section>

      <PinModal
        open={pinOpen}
        onOpenChange={setPinOpen}
        onSuccess={handleSuccess}
        title="Confirm subscription renewal"
        amount={formatNaira(totalPrice)}
      />
    </div>
  );
}
