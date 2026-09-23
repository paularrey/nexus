"use client";

import { motion } from "framer-motion";

import { formatAmount } from "@/lib/utils/format";

type AmountPresetsProps = {
  amounts: number[];
  value: number;
  onChange: (amount: number) => void;
  className?: string;
};

export function AmountPresets({
  amounts,
  value,
  onChange,
  className = "mt-3 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap",
}: AmountPresetsProps) {
  return (
    <div className={className}>
      {amounts.map((preset) => (
        <motion.button
          key={preset}
          type="button"
          whileTap={{ scale: 0.9 }}
          onClick={() => onChange(preset)}
          className={`rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors ${
            value === preset
              ? "border-primary bg-secondary text-primary"
              : "border-border hover:border-primary/40"
          }`}
        >
          ₦{formatAmount(preset)}
        </motion.button>
      ))}
    </div>
  );
}
