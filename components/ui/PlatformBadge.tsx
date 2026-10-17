"use client";

import { motion } from "framer-motion";
import Image from "next/image";

import { cn } from "@/lib/utils";

type PlatformBadgeProps = {
  name: string;
  image: string;
  isSelected?: boolean;
  onSelect: () => void;
  className?: string;
};

export function PlatformBadge({
  name,
  image,
  isSelected = false,
  onSelect,
  className,
}: PlatformBadgeProps) {
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.93 }}
      onClick={onSelect}
      aria-pressed={isSelected}
      className={cn("group flex flex-col items-center gap-2", className)}
    >
      <span
        className={cn(
          "relative size-14 overflow-hidden rounded-full border-2 border-border bg-card transition-all sm:size-16",
          isSelected
            ? "border-primary shadow-[0_0_0_4px_rgb(79_70_229_/_0.18)]"
            : "group-hover:border-primary/40",
        )}
      >
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover"
          sizes="64px"
        />
      </span>
      <span
        className={cn(
          "text-[11px] font-medium sm:text-xs",
          isSelected
            ? "text-primary"
            : "text-muted-foreground group-hover:text-foreground",
        )}
      >
        {name}
      </span>
    </motion.button>
  );
}
