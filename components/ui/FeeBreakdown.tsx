"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";
import type { FeeBreakdownRow } from "@/types";

type FeeBreakdownProps = {
  rows: FeeBreakdownRow[];
  label?: string;
  className?: string;
  contentClassName?: string;
};

export function FeeBreakdown({
  rows,
  label = "Fee breakdown",
  className,
  contentClassName = "space-y-2 pt-4 text-sm",
}: FeeBreakdownProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className={cn(
          "flex w-full items-center justify-between text-sm text-muted-foreground",
          className,
        )}
      >
        <span>{label}</span>
        <ChevronDown
          className={cn(
            "size-4 transition-transform",
            open && "rotate-180",
          )}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className={contentClassName}>
              {rows.map((row) => (
                <div
                  key={row.label}
                  className={cn(
                    "flex justify-between",
                    row.emphasis === "strong" &&
                      "font-semibold text-foreground",
                    row.emphasis === "strong-bordered" &&
                      "border-t border-border pt-2 font-semibold",
                    (!row.emphasis || row.emphasis === "muted") &&
                      "text-muted-foreground",
                  )}
                >
                  <span>{row.label}</span>
                  <span className={row.valueClassName}>{row.value}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
