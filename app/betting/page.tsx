"use client";

import { Gamepad2, ShieldCheck, UserRound } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { toast } from "sonner";

import { AmountPresets } from "@/components/ui/AmountPresets";
import { Button } from "@/components/ui/Button";
import { CardSection } from "@/components/ui/CardSection";
import { PageHeader } from "@/components/ui/PageHeader";
import { PlatformBadge } from "@/components/ui/PlatformBadge";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SuccessBanner } from "@/components/ui/SuccessBanner";
import { useMockVerification } from "@/lib/hooks/useMockVerification";
import { bettingData } from "@/lib/mock-data/betting";
import {
  translations,
  usePreferences,
} from "@/lib/context/preferences-context";

export default function BettingPage() {
  return (
    <Suspense fallback={null}>
      <BettingForm />
    </Suspense>
  );
}

function BettingForm() {
  const { language } = usePreferences();
  const labels = translations[language];
  const router = useRouter();
  const searchParams = useSearchParams();

  const restoredPlatform =
    bettingData.platforms.find(
      (platform) => platform.name === searchParams.get("platform"),
    ) ?? bettingData.platforms[0];
  const restoredUserId = searchParams.get("userId") ?? "";
  const parsedAmount = Number.parseInt(searchParams.get("amount") ?? "", 10);
  const restoredAmount =
    Number.isFinite(parsedAmount) && parsedAmount > 0 ? parsedAmount : 5000;

  const [selectedPlatform, setSelectedPlatform] = useState(restoredPlatform);
  const [userId, setUserId] = useState(restoredUserId);
  const [amount, setAmount] = useState(restoredAmount);
  const [restoredVerified, setRestoredVerified] = useState(
    searchParams.get("verified") === "1",
  );
  const { isVerifying, isVerified, verify, reset } = useMockVerification();
  const verified = isVerified || restoredVerified;

  const clearVerification = () => {
    reset();
    setRestoredVerified(false);
  };

  const verifyAccount = () => {
    verify(Boolean(userId.trim()), {
      title: "Demo account verified",
      description: `${selectedPlatform.name} verification is simulated for this UI preview.`,
    });
  };

  const handleProceed = () => {
    if (!userId.trim()) {
      toast.error("Enter your player ID");
      return;
    }
    if (!verified) {
      toast.error("Verify your player ID first");
      return;
    }
    if (!amount || amount <= 0) {
      toast.error("Select a funding amount");
      return;
    }
    const params = new URLSearchParams({
      platform: selectedPlatform.name,
      userId: userId.trim(),
      amount: String(amount),
      verified: "1",
    });
    router.push(`/betting/summary?${params.toString()}`);
  };

  return (
    <div className="mx-auto w-full max-w-3xl space-y-8">
      <PageHeader
        eyebrow="Betting wallet"
        title={labels.bettingTitle}
        lede="Choose a platform, verify the player ID, and prepare a mock funding request."
      />

      <CardSection>
        <SectionHeader
          icon={Gamepad2}
          title="Choose a platform"
          description="Select the wallet you want to fund."
        />
        <div className="mt-6 grid grid-cols-4 gap-4">
          {bettingData.platforms.map((platform) => (
            <PlatformBadge
              key={platform.name}
              name={platform.name}
              image={platform.image}
              isSelected={selectedPlatform.name === platform.name}
              onSelect={() => {
                setSelectedPlatform(platform);
                clearVerification();
              }}
            />
          ))}
        </div>
      </CardSection>

      <CardSection>
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
                clearVerification();
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
        {verified && (
          <SuccessBanner
            className="mt-4"
            icon={ShieldCheck}
            title="Account verified"
            description={bettingData.mockAccountName}
          />
        )}

        <div className="mt-8">
          <p className="text-sm font-medium">Funding amount</p>
          <AmountPresets
            amounts={bettingData.amounts}
            value={amount}
            onChange={setAmount}
          />
        </div>
      </CardSection>

      <Button
        type="button"
        size="lg"
        onClick={handleProceed}
        disabled={isVerifying}
        className="h-12 w-full rounded-xl bg-primary text-primary-foreground hover:bg-primary-hover"
      >
        Proceed
      </Button>
    </div>
  );
}
