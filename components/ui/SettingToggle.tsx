"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

type SettingToggleProps = {
  label: string;
  description: string;
  icon: LucideIcon;
  enabled: boolean;
  onChange: () => void;
};

export function SettingToggle({
  label,
  description,
  icon: Icon,
  enabled,
  onChange,
}: SettingToggleProps) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-border py-4 last:border-b-0">
      <div className="flex min-w-0 items-center gap-3">
        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-secondary text-primary">
          <Icon className="size-5" />
        </span>
        <div className="min-w-0">
          <p className="font-medium">{label}</p>
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        aria-label={`${label}: ${enabled ? "on" : "off"}`}
        onClick={onChange}
        className={`relative h-7 w-12 shrink-0 rounded-full p-1 transition-colors ${enabled ? "bg-primary" : "bg-muted"}`}
      >
        <motion.span
          layout
          transition={{ type: "spring", stiffness: 520, damping: 30 }}
          className={`block size-5 rounded-full bg-card shadow-sm ${enabled ? "ml-5" : "ml-0"}`}
        />
      </button>
    </div>
  );
}
