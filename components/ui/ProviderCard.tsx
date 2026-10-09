"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import Image from "next/image";

import type { LucideIcon } from "lucide-react";

type ProviderCardProps = {
  name: string;
  shortName: string;
  color: string;
  image?: string;
  icon?: LucideIcon;
  subtitle?: string;
  shortNameTextSize?: "sm" | "lg";
  isSelected: boolean;
  onSelect: () => void;
};

export function ProviderCard({
  name,
  shortName,
  color,
  image,
  icon,
  subtitle,
  shortNameTextSize = "sm",
  isSelected,
  onSelect,
}: ProviderCardProps) {
  const Icon = icon;
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.95 }}
      onClick={onSelect}
      className="relative flex min-h-28 flex-col items-start justify-between rounded-2xl border p-4 text-left transition-shadow"
      style={{
        borderColor: isSelected ? color : undefined,
        boxShadow: isSelected
          ? `0 0 0 3px ${color}25, 0 12px 24px ${color}22`
          : undefined,
      }}
      aria-pressed={isSelected}
    >
      {image ? (
        <span className="grid size-10 shrink-0 place-items-center overflow-hidden rounded-xl bg-muted">
          <Image
            src={image}
            alt={`${name} logo`}
            width={28}
            height={28}
            className="object-contain"
          />
        </span>
      ) : Icon ? (
        <span
          className="grid size-10 shrink-0 place-items-center rounded-xl text-white"
          style={{ backgroundColor: color }}
        >
          <Icon className="size-5" />
        </span>
      ) : (
        <span
          className={`grid size-10 place-items-center rounded-xl font-bold text-white ${
            shortNameTextSize === "lg" ? "text-lg" : "text-sm"
          }`}
          style={{ backgroundColor: color }}
        >
          {shortName}
        </span>
      )}
      {subtitle !== undefined ? (
        <span>
          <span className="block font-semibold">{name}</span>
          <span className="text-xs text-muted-foreground">{subtitle}</span>
        </span>
      ) : (
        <span className="font-semibold">{name}</span>
      )}
      {isSelected && (
        <Check className="absolute right-3 top-3 size-4 text-success" />
      )}
    </motion.button>
  );
}
