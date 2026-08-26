"use client";

import { motion } from "framer-motion";
import { Check, Gamepad2, ShieldCheck, UserRound } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { PinModal } from "@/components/PinModal";
import { useAuthGate } from "@/hooks/useAuthGate";
import { bettingData } from "@/lib/mock-data/betting";
import {
  translations,
  usePreferences,
} from "@/lib/context/preferences-context";

export default function BettingPage() {
  const { language } = usePreferences();
  const labels = translations[language];
  const [selectedPlatform, setSelectedPlatform] = useState(
    bettingData.platforms[0],
  );
  const [userId, setUserId] = useState("");
  const [amount, setAmount] = useState(5000);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [pinOpen, setPinOpen] = useState(false);
  const authGate = useAuthGate();

  const verifyAccount = () => {
    if (!userId.trim()) return;
    setIsVerifying(true);
    setIsVerified(false);
    window.setTimeout(() => {
      setIsVerifying(false);
      setIsVerified(true);
      toast.success("Demo account verified", {
        description: `${selectedPlatform.name} verification is simulated for this UI preview.`,
      });
    }, 700);
  };

  const fundAccount = () => {
    authGate(() => {
      setPinOpen(true);
    });
  };

  return (
    <div className="mx-auto w-full max-w-5xl space-y-8">
      <header>
        <p className="text-sm font-medium text-primary">Betting wallet</p>
        <h1 className="mt-1 font-heading text-3xl font-semibold tracking-tight md:text-4xl">
          {labels.bettingTitle}
        </h1>
        <p className="mt-2 text-muted-foreground">
          Choose a platform, verify the player ID, and prepare a mock funding
          request.
        </p>
      </header>

      <section className="rounded-[28px] border border-border bg-card p-5 md:p-8">
        <div className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-xl bg-secondary text-primary">
            <Gamepad2 className="size-5" />
          </span>
          <div>
            <h2 className="font-heading text-xl font-semibold">
              Choose a platform
            </h2>
            <p className="text-sm text-muted-foreground">
              Select the wallet you want to fund.
            </p>
          </div>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
          {bettingData.platforms.map((platform) => {
            const isSelected = selectedPlatform.name === platform.name;
            return (
              <motion.button
                key={platform.name}
                type="button"
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setSelectedPlatform(platform);
                  setIsVerified(false);
                }}
                className="relative flex min-h-28 flex-col items-start justify-between rounded-2xl border p-4 text-left transition-shadow"
                style={{
                  borderColor: isSelected ? platform.color : undefined,
                  boxShadow: isSelected
                    ? `0 0 0 3px ${platform.color}25, 0 12px 24px ${platform.color}22`
                    : undefined,
                }}
                aria-pressed={isSelected}
              >
                <span
                  className="grid size-10 place-items-center rounded-xl text-sm font-bold text-white"
                  style={{ backgroundColor: platform.color }}
                >
                  {platform.shortName}
                </span>
                <span className="font-semibold">{platform.name}</span>
                {isSelected && (
                  <Check className="absolute right-3 top-3 size-4 text-success" />
                )}
              </motion.button>
            );
          })}
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[28px] border border-border bg-card p-5 md:p-8">
          <label
            className="block text-sm font-medium"
            htmlFor="betting-user-id"
          >
            Player ID
            <span className="relative mt-2 block">
              <UserRound className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                id="betting-user-id"
                type="text"
                value={userId}
                onChange={(event) => {
                  setUserId(event.target.value);
                  setIsVerified(false);
                }}
                placeholder="Enter your player ID"
                className="h-12 w-full rounded-xl border border-input bg-background pl-10 pr-24 outline-none transition focus:border-primary focus:ring-3 focus:ring-primary/15"
              />
              <button
                type="button"
                onClick={verifyAccount}
                disabled={!userId.trim() || isVerifying}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg bg-secondary px-3 py-1.5 text-xs font-semibold text-secondary-foreground disabled:opacity-50"
              >
                {isVerifying ? "Checking..." : "Verify"}
              </button>
            </span>
          </label>
          {isVerified && (
            <div className="mt-4 flex items-center gap-3 rounded-2xl border border-success/30 bg-success/10 p-4 text-success">
              <ShieldCheck className="size-5" />
              <div>
                <p className="font-semibold">Account verified</p>
                <p className="text-sm text-success/80">
                  {bettingData.mockAccountName}
                </p>
              </div>
            </div>
          )}

          <div className="mt-8">
            <p className="text-sm font-medium">Funding amount</p>
            <div className="mt-3 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
              {bettingData.amounts.map((preset) => (
                <motion.button
                  key={preset}
                  type="button"
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setAmount(preset)}
                  className={`rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors ${amount === preset ? "border-primary bg-secondary text-primary" : "border-border hover:border-primary/40"}`}
                >
                  ₦{preset.toLocaleString("en-NG")}
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        <aside className="flex flex-col justify-between rounded-[28px] bg-[#0b1f3a] p-5 text-white shadow-[0_20px_50px_rgba(11,31,58,0.18)] md:p-8">
          <div>
            <p className="text-sm text-blue-100/65">Funding preview</p>
            <p className="mt-3 font-heading text-3xl font-semibold">
              ₦{amount.toLocaleString("en-NG")}
            </p>
            <p className="mt-2 text-sm text-blue-100/65">
              {selectedPlatform.name} · {userId || "Player ID needed"}
            </p>
          </div>
          <Button
            type="button"
            size="lg"
            onClick={fundAccount}
            disabled={!userId || !isVerified || pinOpen}
            className="mt-8 h-12 w-full bg-accent text-white hover:bg-accent/90"
          >
            Fund Betting Wallet
          </Button>
        </aside>
      </section>
      <PinModal
        open={pinOpen}
        onOpenChange={setPinOpen}
        onSuccess={() =>
          toast.success("Funding request ready", {
            description: `Mock funding for ${selectedPlatform.name}.`,
          })
        }
        title="Confirm betting wallet funding"
        amount={`₦${amount.toLocaleString("en-NG")}`}
      />
    </div>
  );
}
