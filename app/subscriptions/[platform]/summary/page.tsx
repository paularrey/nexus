"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, use, useState } from "react";
import { toast } from "sonner";

import { PinModal } from "@/components/payments/PinModal";
import { ConfirmStep } from "@/components/subscriptions/ConfirmStep";
import {
  PaymentStep,
  type PaymentMethod,
} from "@/components/subscriptions/PaymentStep";
import { StepIndicator } from "@/components/subscriptions/StepIndicator";
import { BackLink } from "@/components/ui/BackLink";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/ui/PageHeader";
import { usePinFlow } from "@/lib/hooks/usePinFlow";
import { dashboardData } from "@/lib/mock-data/dashboard";
import { subscriptionData } from "@/lib/mock-data/subscriptions";
import { formatNaira } from "@/lib/utils/format";
import {
  getProviderBySlug,
  getSubscriptionPricing,
  isValidEmailOrPhone,
} from "@/lib/utils/subscription";

const steps = [
  { key: "platform", label: "Platform" },
  { key: "plan", label: "Plan" },
  { key: "summary", label: "Summary" },
] as const;

type SummaryPageProps = {
  params: Promise<{ platform: string }>;
};

export default function SubscriptionSummaryPage({ params }: SummaryPageProps) {
  return (
    <Suspense fallback={null}>
      <SummaryContent params={params} />
    </Suspense>
  );
}

function SummaryContent({ params }: SummaryPageProps) {
  const { platform } = use(params);
  const provider = getProviderBySlug(platform);
  const searchParams = useSearchParams();
  const { pinOpen, setPinOpen, openPin } = usePinFlow();

  const planIndex = Number.parseInt(searchParams.get("plan") ?? "1", 10);
  const durationIndex = Number.parseInt(
    searchParams.get("duration") ?? "0",
    10,
  );
  const accountValue = searchParams.get("account") ?? "";
  const verified = searchParams.get("verified") === "1";
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(
    searchParams.get("payment") === "card" ? "card" : "wallet",
  );

  if (!provider) {
    return (
      <div className="mx-auto w-full max-w-2xl space-y-6">
        <BackLink href="/subscriptions">All subscriptions</BackLink>
        <EmptyState
          title="Platform not found"
          description="Pick a service from the subscriptions list to continue."
        >
          <Button asChild variant="outline" className="mt-6">
            <Link href="/subscriptions">Back to subscriptions</Link>
          </Button>
        </EmptyState>
      </div>
    );
  }

  const {
    isCable,
    selectedPlan,
    safePlanIndex,
    safeDurationIndex,
    totalPrice,
    billingCycle,
    renewalDate,
  } = getSubscriptionPricing(provider, planIndex, durationIndex);

  const planHref = `/subscriptions/${provider.name.toLowerCase()}/plan?${new URLSearchParams(
    {
      plan: String(safePlanIndex),
      duration: String(safeDurationIndex),
      account: accountValue,
      verified: verified ? "1" : "0",
    },
  ).toString()}`;

  const accountValid = isCable
    ? verified && accountValue.trim().length > 0
    : isValidEmailOrPhone(accountValue);
  const paymentValid = paymentMethod !== null;
  const isValid = accountValid && paymentValid;

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

  return (
    <div className="mx-auto w-full max-w-3xl space-y-8">
      <PageHeader
        eyebrow="Subscriptions"
        title="Transaction summary"
        lede="Review your renewal below, then confirm the payment."
      />

      <StepIndicator steps={steps} current={2} />

      {!isValid ? (
        <section className="rounded-[28px] border border-border bg-surface p-6 text-center text-foreground shadow-[0_4px_24px_color-mix(in_srgb,var(--foreground)_6%,transparent)]">
          <p className="font-heading text-xl font-semibold">
            Nothing to review
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            We couldn&apos;t find a valid subscription order. Go back and pick
            your plan first.
          </p>
          <Button
            asChild
            size="lg"
            className="mt-5 h-12 w-full rounded-xl bg-primary text-primary-foreground hover:bg-primary-hover"
          >
            <Link href={`/subscriptions/${provider.name.toLowerCase()}/plan`}>
              Back to plan
            </Link>
          </Button>
        </section>
      ) : (
        <div className="space-y-5">
          <PaymentStep
            value={paymentMethod}
            onChange={setPaymentMethod}
            amount={totalPrice}
            walletBalance={dashboardData.balance}
            cardNumber={dashboardData.cardNumber}
            cardExpiry={dashboardData.expiry}
          />
          <ConfirmStep
            provider={provider}
            plan={selectedPlan}
            paymentLabel={paymentLabel}
            renewalDate={renewalDate}
            billingCycle={billingCycle}
            accountLabel={accountLabel}
            accountValue={accountDisplay}
            totalPrice={totalPrice}
          />

          <div className="flex items-center justify-between gap-3">
            <Button asChild variant="ghost" className="gap-1.5">
              <Link href={planHref}>
                <ArrowLeft /> Back
              </Link>
            </Button>
            <Button
              type="button"
              size="lg"
              onClick={openPin}
              disabled={pinOpen}
              className="h-11 px-6"
            >
              Confirm &amp; Pay {formatNaira(totalPrice)}
            </Button>
          </div>
        </div>
      )}

      <PinModal
        open={pinOpen}
        onOpenChange={setPinOpen}
        onSuccess={() =>
          toast.success("Subscription set up", {
            description: `${provider.name} ${selectedPlan.name} renews on ${renewalDate}.`,
          })
        }
        title="Confirm subscription renewal"
        amount={formatNaira(totalPrice)}
      />
    </div>
  );
}
