"use client";

import { AnimatePresence, motion } from "framer-motion";
import { FileCheck2, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { CardSection } from "@/components/ui/CardSection";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SuccessBanner } from "@/components/ui/SuccessBanner";
import type { SubscriptionProvider } from "@/types";

type AccountStepProps = {
  provider: SubscriptionProvider;
  value: string;
  onValueChange: (value: string) => void;
  isVerifying: boolean;
  isVerified: boolean;
  onVerify: () => void;
  onReset: () => void;
  accountName: string;
};

export function AccountStep({
  provider,
  value,
  onValueChange,
  isVerifying,
  isVerified,
  onVerify,
  onReset,
  accountName,
}: AccountStepProps) {
  const isCable = provider.kind === "cable";

  if (isCable) {
    return (
      <CardSection>
        <SectionHeader
          icon={FileCheck2}
          title="Verify your decoder"
          description="Enter your smart card or IUC number so we can find your account."
        />

        <label
          className="mt-6 block text-sm font-medium"
          htmlFor="subscription-iuc"
        >
          Smart card / IUC number
          <span className="mt-2 flex flex-col gap-2 sm:flex-row">
            <input
              id="subscription-iuc"
              type="text"
              inputMode="numeric"
              value={value}
              onChange={(event) => {
                onValueChange(event.target.value);
                onReset();
              }}
              placeholder="e.g. 7032458891"
              className="h-12 min-w-0 flex-1 rounded-xl border border-input bg-background px-3 outline-none transition focus:border-primary focus:ring-3 focus:ring-primary/15"
            />
            <Button
              type="button"
              variant="secondary"
              onClick={onVerify}
              disabled={!value.trim() || isVerifying}
              className="h-12 min-w-[120px]"
            >
              {isVerifying ? "Checking..." : "Verify"}
            </Button>
          </span>
        </label>

        <AnimatePresence initial={false}>
          {isVerified && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -8 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0, y: -8 }}
              className="mt-5 overflow-hidden"
            >
              <SuccessBanner
                icon={ShieldCheck}
                title={accountName}
                description={`${provider.name} account found · demo result`}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </CardSection>
    );
  }

  return (
    <CardSection>
      <SectionHeader
        icon={FileCheck2}
        title="Your streaming account"
        description={`Enter the email address or phone number tied to your ${provider.name} account.`}
      />
      <label
        className="mt-6 block text-sm font-medium"
        htmlFor="subscription-account"
      >
        Account email or phone number
        <input
          id="subscription-account"
          type="text"
          value={value}
          onChange={(event) => onValueChange(event.target.value)}
          placeholder="you@example.com or 0803 000 0000"
          className="mt-2 h-12 w-full rounded-xl border border-input bg-background px-3 outline-none transition focus:border-primary focus:ring-3 focus:ring-primary/15"
        />
      </label>
      <p className="mt-3 text-xs text-muted-foreground">
        We&apos;ll link this renewal to that account. Demo only — nothing is
        really sent.
      </p>
    </CardSection>
  );
}
