"use client";

import { motion } from "framer-motion";
import Image from "next/image";

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
      <div className="absolute inset-0 bg-primary/10" />
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={
          isVisible
            ? { opacity: 1, scale: 1 }
            : { opacity: 0, scale: 0.8 }
        }
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative flex flex-col items-center gap-8"
      >
        <Image
          src="/ravelogo512.png"
          alt="Ravecard"
          width={160}
          height={160}
          priority
          className="rounded-[36px] shadow-[0_32px_80px_color-mix(in_srgb,var(--primary)_28%,transparent)]"
        />
        <div className="text-center">
          <p className="font-heading text-3xl font-bold tracking-tight text-foreground">
            Welcome
          </p>
          <p className="mx-auto mt-3 max-w-xs text-base leading-relaxed text-muted-foreground">
            Hi there - Welcome to Ravecard. Your money, made simple.
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
