import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

type StepIndicatorProps = {
  steps: readonly { label: string }[];
  current: number;
};

export function StepIndicator({ steps, current }: StepIndicatorProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <ol className="flex min-w-0 flex-1 items-center" aria-label="Renewal progress">
      {steps.map((step, index) => {
        const done = index < current;
        const active = index === current;
        return (
          <li
            key={step.label}
            className={cn(
              "flex min-w-0 flex-1 items-center gap-2 sm:gap-3",
              index === steps.length - 1 && "flex-none",
            )}
            aria-current={active ? "step" : undefined}
          >
            <span
              className={cn(
                "grid size-8 shrink-0 place-items-center rounded-full text-sm font-bold transition-colors",
                done && "bg-primary text-primary-foreground",
                active &&
                  "bg-primary text-primary-foreground shadow-[0_0_0_4px_color-mix(in_srgb,var(--primary)_18%,transparent)]",
                !done && !active && "bg-muted text-muted-foreground",
              )}
            >
              {done ? <Check className="size-4" /> : index + 1}
            </span>
            <span
              className={cn(
                "truncate text-sm font-medium",
                active ? "text-foreground" : "text-muted-foreground",
              )}
            >
              {step.label}
            </span>
            {index < steps.length - 1 && (
              <span aria-hidden className="h-px flex-1 bg-border" />
            )}
          </li>
        );
      })}
      </ol>
      <span className="shrink-0 text-xs font-medium text-muted-foreground">
        Step {current + 1} of {steps.length}
      </span>
    </div>
  );
}
