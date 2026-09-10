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
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(255,87,51,0.2),transparent_50%)]" />
      <motion.div
        initial={{ opacity: 0, scale: 0.72, rotate: -8 }}
        animate={
          isVisible
            ? { opacity: 1, scale: 1, rotate: 0 }
            : { opacity: 0, scale: 1.08, rotate: 4 }
        }
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative flex flex-col items-center gap-8"
      >
        <div className="relative grid size-40 place-items-center rounded-[36px] border border-primary/20 bg-gradient-to-br from-[#c44420] to-[#FF5733] shadow-[0_32px_100px_rgba(255,87,51,0.35)]">
          <div className="absolute inset-3 rounded-[28px] border border-white/15" />
          <Image
            src="/ravelogo512.png"
            alt="Ravecard"
            width={120}
            height={120}
            className="relative z-10"
            priority
          />
          <motion.span
            initial={{ x: "-140%" }}
            animate={isVisible ? { x: "140%" } : { x: "-140%" }}
            transition={{ delay: 0.35, duration: 0.8, ease: "easeInOut" }}
            className="absolute inset-y-0 w-10 -skew-x-12 bg-white/25 blur-md"
          />
        </div>
        <div className="text-center">
          <p className="font-heading text-3xl font-bold tracking-tight text-foreground">
            Ravecard
          </p>
          <p className="mt-2 text-base text-muted-foreground">
            Spend Smarter. Live Freer.
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
