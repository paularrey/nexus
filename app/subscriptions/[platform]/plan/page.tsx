"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, use, useState } from "react";
import { toast } from "sonner";

import { AccountStep } from "@/components/subscriptions/AccountStep";
import { PlanStep } from "@/components/subscriptions/PlanStep";
import { StepIndicator } from "@/components/subscriptions/StepIndicator";
import { BackLink } from "@/components/ui/BackLink";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/ui/PageHeader";
import { useMockVerification } from "@/lib/hooks/useMockVerification";
import { subscriptionData } from "@/lib/mock-data/subscriptions";
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

type PlanPageProps = {
  params: Promise<{ platform: string }>;
};

export default function PlanPage({ params }: PlanPageProps) {
  return (
    <Suspense fallback={null}>
      <PlanContent params={params} />
    </Suspense>
  );
}

function PlanContent({ params }: PlanPageProps) {
  const { platform } = use(params);
  const provider = getProviderBySlug(platform);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isVerifying, isVerified, verify, reset } = useMockVerification();

  const [planIndex, setPlanIndex] = useState(() => {
    const parsed = Number.parseInt(searchParams.get("plan") ?? "1", 10);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
  });
  const [durationIndex, setDurationIndex] = useState(() => {
    const parsed = Number.parseInt(searchParams.get("duration") ?? "0", 10);
    return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
  });
  const [accountValue, setAccountValue] = useState(
    searchParams.get("account") ?? "",
  );
  const [restoredVerified, setRestoredVerified] = useState(
    searchParams.get("verified") === "1",
  );
  const verified = isVerified || restoredVerified;

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

  const { isCable } = getSubscriptionPricing(provider, planIndex, durationIndex);

  const clearVerification = () => {
    reset();
    setRestoredVerified(false);
  };

  const handleVerify = () => {
    verify(Boolean(accountValue.trim()), {
      title: "Decoder verified",
      description: `${subscriptionData.mockAccountName} · ${provider.name}`,
    });
  };

  const accountValid = isCable
    ? verified
    : isValidEmailOrPhone(accountValue);

  const handleContinue = () => {
    const trimmed = accountValue.trim();
    if (!accountValid) {
      toast.error(
        isCable
          ? "Verify your decoder first"
          : "Enter a valid email or phone number",
      );
      return;
    }
    const pricing = getSubscriptionPricing(provider, planIndex, durationIndex);
    const url = new URLSearchParams({
      plan: String(pricing.safePlanIndex),
      duration: String(pricing.safeDurationIndex),
      account: trimmed,
      verified: verified ? "1" : "0",
    });
    router.push(
      `/subscriptions/${provider.name.toLowerCase()}/summary?${url.toString()}`,
    );
  };

  return (
    <div className="mx-auto w-full max-w-3xl space-y-8">
      <PageHeader
        eyebrow="Subscriptions"
        title={`${provider.name} ${isCable ? "bouquets" : "plans"}`}
        lede={
          isCable
            ? "Pick a bouquet, verify your decoder, then continue."
            : "Pick a plan and link your account, then continue."
        }
      />

      <StepIndicator steps={steps} current={1} />

      <div className="space-y-5">
        <PlanStep
          selectedProvider={provider}
          planIndex={planIndex}
          onPlanChange={setPlanIndex}
          durationIndex={durationIndex}
          onDurationChange={setDurationIndex}
        />
        <AccountStep
          provider={provider}
          value={accountValue}
          onValueChange={(value) => {
            setAccountValue(value);
            clearVerification();
          }}
          isVerifying={isVerifying}
          isVerified={verified}
          onVerify={handleVerify}
          onReset={clearVerification}
          accountName={subscriptionData.mockAccountName}
        />
      </div>

      <div className="flex items-center justify-between gap-3">
        <Button asChild variant="ghost" className="gap-1.5">
          <Link href="/subscriptions">
            <ArrowLeft /> Back
          </Link>
        </Button>
        <Button
          type="button"
          size="lg"
          onClick={handleContinue}
          disabled={isVerifying}
          className="h-11 px-6"
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
