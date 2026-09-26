"use client";

import { Gamepad2, ShieldCheck, UserRound } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { PinModal } from "@/components/payments/PinModal";
import { AmountPresets } from "@/components/ui/AmountPresets";
import { Button } from "@/components/ui/Button";
import { CardSection } from "@/components/ui/CardSection";
import { PageHeader } from "@/components/ui/PageHeader";
import { ProviderCard } from "@/components/ui/ProviderCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SuccessBanner } from "@/components/ui/SuccessBanner";
import { useMockVerification } from "@/lib/hooks/useMockVerification";
import { usePinFlow } from "@/lib/hooks/usePinFlow";
import { bettingData } from "@/lib/mock-data/betting";
import { formatNaira } from "@/lib/utils/format";
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
  const { pinOpen, setPinOpen, openPin } = usePinFlow();
  const { isVerifying, isVerified, verify, reset } = useMockVerification();

  const verifyAccount = () => {
    verify(Boolean(userId.trim()), {
      title: "Demo account verified",
      description: `${selectedPlatform.name} verification is simulated for this UI preview.`,
    });
  };

  return (
    <div className="mx-auto w-full max-w-5xl space-y-8">
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
        <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
          {bettingData.platforms.map((platform) => (
            <ProviderCard
              key={platform.name}
              name={platform.name}
              shortName={platform.shortName}
              color={platform.color}
              isSelected={selectedPlatform.name === platform.name}
              onSelect={() => {
                setSelectedPlatform(platform);
                reset();
              }}
            />
          ))}
        </div>
      </CardSection>

      <section className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
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
                  reset();
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

        <aside className="flex flex-col justify-between rounded-[28px] border border-border bg-surface p-5 text-foreground shadow-[0_4px_24px_rgb(15_23_42_/_0.06)] md:p-8">
          <div>
            <p className="text-sm text-muted-foreground">Funding preview</p>
            <p className="mt-3 font-heading text-3xl font-semibold">
              {formatNaira(amount)}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              {selectedPlatform.name} · {userId || "Player ID needed"}
            </p>
          </div>
          <Button
            type="button"
            size="lg"
            onClick={openPin}
            disabled={!userId || !isVerified || pinOpen}
            className="mt-8 h-12 w-full rounded-full bg-primary text-primary-foreground hover:bg-primary-hover"
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
        amount={formatNaira(amount)}
      />
    </div>
  );
}
