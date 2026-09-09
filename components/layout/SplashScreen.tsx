"use client";

import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

type SplashScreenProps = {
  isVisible: boolean;
};

export function SplashScreen({ isVisible }: SplashScreenProps) {
  return (
    <motion.div
      initial={false}
      animate={{ opacity: isVisible ? 1 : 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-background",
        !isVisible && "pointer-events-none",
      )}
      aria-hidden={!isVisible}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(224,122,95,0.15),transparent_42%)]" />
      <motion.div
        initial={{ opacity: 0, scale: 0.72, rotate: -8 }}
        animate={
          isVisible
            ? { opacity: 1, scale: 1, rotate: 0 }
            : { opacity: 0, scale: 1.08, rotate: 4 }
        }
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative flex flex-col items-center gap-5"
      >
        <div className="relative grid size-24 place-items-center rounded-[28px] border border-primary/20 bg-gradient-to-br from-[#c45a3c] to-[#e07a5f] shadow-[0_24px_80px_rgba(224,122,95,0.3)]">
          <div className="absolute inset-2 rounded-[20px] border border-white/15" />
          <span className="font-heading text-5xl font-bold tracking-[-0.08em] text-white">
            N
          </span>
          <motion.span
            initial={{ x: "-140%" }}
            animate={isVisible ? { x: "140%" } : { x: "-140%" }}
            transition={{ delay: 0.35, duration: 0.8, ease: "easeInOut" }}
            className="absolute inset-y-0 w-8 -skew-x-12 bg-white/25 blur-md"
          />
        </div>
        <div className="text-center">
          <p className="font-heading text-2xl font-semibold tracking-tight text-foreground">
            Nexus
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Your money, in motion.
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
