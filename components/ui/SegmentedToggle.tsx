"use client";

import { cn } from "@/lib/utils";

type SegmentedToggleProps<T extends string> = {
  options: readonly T[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
};

export function SegmentedToggle<T extends string>({
  options,
  value,
  onChange,
  className,
}: SegmentedToggleProps<T>) {
  return (
    <div
      className={cn(
        "grid grid-cols-2 rounded-2xl bg-muted p-1",
        className,
      )}
    >
      {options.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => onChange(option)}
          className={`rounded-xl px-4 py-3 text-sm font-semibold capitalize transition-colors ${
            value === option
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
          aria-pressed={value === option}
        >
          {option}
        </button>
      ))}
    </div>
  );
}
