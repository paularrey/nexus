import { billingDurations, subscriptionData } from "@/lib/mock-data/subscriptions";
import type { SubscriptionProvider } from "@/types";

export function getProviderBySlug(
  slug: string,
): SubscriptionProvider | undefined {
  return subscriptionData.providers.find(
    (provider) => provider.name.toLowerCase() === slug,
  );
}

export function isValidEmailOrPhone(value: string) {
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

export function getSubscriptionPricing(
  provider: SubscriptionProvider,
  planIndex: number,
  durationIndex: number,
) {
  const isCable = provider.kind === "cable";
  const safePlanIndex = Math.min(
    Math.max(planIndex, 0),
    provider.plans.length - 1,
  );
  const safeDurationIndex = Math.min(
    Math.max(durationIndex, 0),
    billingDurations.length - 1,
  );
  const selectedPlan = provider.plans[safePlanIndex];
  const duration = billingDurations[safeDurationIndex];
  const totalPrice = isCable
    ? Math.round((selectedPlan.price * duration.multiplier) / 50) * 50
    : selectedPlan.price;
  const billingCycle = isCable ? duration.label : selectedPlan.duration;
  const cycleDays = isCable
    ? duration.months * 30
    : renewalDays(selectedPlan.duration);
  const renewalDate = renewalDateAfter(cycleDays);

  return {
    isCable,
    selectedPlan,
    duration,
    safePlanIndex,
    safeDurationIndex,
    totalPrice,
    billingCycle,
    renewalDate,
  };
}
