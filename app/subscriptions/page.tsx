"use client";

import { useRouter } from "next/navigation";

import { StepIndicator } from "@/components/subscriptions/StepIndicator";
import { PageHeader } from "@/components/ui/PageHeader";
import { PlatformBadge } from "@/components/ui/PlatformBadge";
import { subscriptionData } from "@/lib/mock-data/subscriptions";

const steps = [
  { key: "platform", label: "Platform" },
  { key: "plan", label: "Plan" },
  { key: "summary", label: "Summary" },
] as const;

export default function SubscriptionsPage() {
  const router = useRouter();

  return (
    <div className="mx-auto w-full max-w-3xl space-y-8">
      <PageHeader
        eyebrow="Subscriptions"
        title="Never miss a renewal."
        lede="Choose a streaming, music, or cable provider and prepare a mock renewal."
        ledeClassName="mt-2 max-w-2xl text-muted-foreground"
      />

      <StepIndicator steps={steps} current={0} />

      <section>
        <p className="text-sm font-medium">Choose a platform</p>
        <div className="mt-5 grid grid-cols-3 gap-x-4 gap-y-6 sm:grid-cols-6">
          {subscriptionData.providers.map((provider) => (
            <PlatformBadge
              key={provider.name}
              name={provider.name}
              image={provider.image}
              onSelect={() =>
                router.push(
                  `/subscriptions/${provider.name.toLowerCase()}/plan`,
                )
              }
            />
          ))}
        </div>
      </section>
    </div>
  );
}
