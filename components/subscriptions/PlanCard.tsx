import { motion } from "framer-motion";
import { Check } from "lucide-react";

import { formatNaira } from "@/lib/utils/format";
import type { SubscriptionPlan } from "@/types";

type PlanCardProps = {
  plan: SubscriptionPlan;
  price?: number;
  isSelected: boolean;
  onSelect: () => void;
};

export function PlanCard({
  plan,
  price,
  isSelected,
  onSelect,
}: PlanCardProps) {
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.96 }}
      onClick={onSelect}
      aria-pressed={isSelected}
      className={`rounded-2xl border p-4 text-left transition-colors ${isSelected ? "border-primary bg-secondary text-primary" : "border-border hover:border-primary/40"}`}
    >
      <span className="flex items-center justify-between gap-2 font-semibold">
        {plan.name}
        {isSelected && <Check className="size-4" />}
      </span>
      <span className="mt-2 block text-xl font-semibold text-foreground">
        {formatNaira(price ?? plan.price)}
      </span>
      <span className="mt-1 block text-xs text-muted-foreground">
        {plan.detail} · {plan.duration}
      </span>
    </motion.button>
  );
}
