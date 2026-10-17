import Image from "next/image";

import { PlanCard } from "@/components/subscriptions/PlanCard";
import { CardSection } from "@/components/ui/CardSection";
import { billingDurations } from "@/lib/mock-data/subscriptions";
import { cn } from "@/lib/utils";
import type { SubscriptionProvider } from "@/types";

type PlanStepProps = {
  selectedProvider: SubscriptionProvider;
  planIndex: number;
  onPlanChange: (index: number) => void;
  durationIndex: number;
  onDurationChange: (index: number) => void;
};

export function PlanStep({
  selectedProvider,
  planIndex,
  onPlanChange,
  durationIndex,
  onDurationChange,
}: PlanStepProps) {
  const isCable = selectedProvider.kind === "cable";
  const duration = billingDurations[durationIndex];

  return (
    <CardSection>
      <div className="flex items-center gap-3">
        <span className="relative size-11 shrink-0 overflow-hidden rounded-full border-2 border-border bg-card">
          <Image
            src={selectedProvider.image}
            alt={`${selectedProvider.name} logo`}
            fill
            className="object-cover"
            sizes="44px"
          />
        </span>
        <div>
          <h2 className="font-heading text-xl font-semibold">
            {selectedProvider.name} {isCable ? "bouquets" : "plans"}
          </h2>
          <p className="text-sm text-muted-foreground">
            {isCable
              ? "Pick a bouquet, then how long you want it for."
              : "Pick the tier that fits you."}
          </p>
        </div>
      </div>

      {isCable && (
        <div className="mt-5">
          <p className="text-sm font-medium">Duration</p>
          <div
            className="mt-2 flex flex-wrap gap-2"
            role="radiogroup"
            aria-label="Billing duration"
          >
            {billingDurations.map((option, index) => (
              <button
                key={option.label}
                type="button"
                role="radio"
                aria-checked={index === durationIndex}
                onClick={() => onDurationChange(index)}
                className={cn(
                  "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                  index === durationIndex
                    ? "border-primary bg-secondary text-primary"
                    : "border-border text-muted-foreground hover:border-primary/40",
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="mt-5 grid gap-2 sm:grid-cols-3">
        {selectedProvider.plans.map((plan, index) => (
          <PlanCard
            key={plan.name}
            plan={plan}
            price={
              isCable
                ? Math.round((plan.price * duration.multiplier) / 50) * 50
                : undefined
            }
            isSelected={index === planIndex}
            onSelect={() => onPlanChange(index)}
          />
        ))}
      </div>
    </CardSection>
  );
}
