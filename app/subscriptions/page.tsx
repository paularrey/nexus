"use client";

import { motion } from "framer-motion";
import { Check, CreditCard, Tv } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { PinModal } from "@/components/payments/PinModal";
import { Button } from "@/components/ui/Button";
import { ProviderCard } from "@/components/ui/ProviderCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { useAuthGate } from "@/lib/hooks/useAuthGate";
import { subscriptionData } from "@/lib/mock-data/subscriptions";
import { formatAmount } from "@/lib/utils/format";
import type { SubscriptionProvider } from "@/types";

export default function SubscriptionsPage() {
  const [selectedProvider, setSelectedProvider] =
    useState<SubscriptionProvider>(subscriptionData.providers[0]);
  const [selectedPlanIndex, setSelectedPlanIndex] = useState(1);
  const [accountNumber, setAccountNumber] = useState("");
  const [pinOpen, setPinOpen] = useState(false);
  const authGate = useAuthGate();
  const selectedPlan = selectedProvider.plans[selectedPlanIndex];

  const chooseProvider = (provider: SubscriptionProvider) => {
    setSelectedProvider(provider);
    setSelectedPlanIndex(1);
  };

  const confirmSubscription = () => {
    authGate(() => setPinOpen(true));
  };

  return (
    <div className="mx-auto w-full max-w-5xl space-y-8">
      <header>
        <p className="text-sm font-medium text-primary">Subscriptions</p>
        <h1 className="mt-1 font-heading text-3xl font-semibold tracking-tight md:text-4xl">
          Never miss a renewal.
        </h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Choose a streaming, music, or cable provider and prepare a mock
          renewal.
        </p>
      </header>

      <section className="rounded-[28px] border border-border bg-card p-5 md:p-8">
        <SectionHeader
          icon={Tv}
          title="Choose a provider"
          description="Select the subscription you want to renew."
        />
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {subscriptionData.providers.map((provider) => (
            <ProviderCard
              key={provider.name}
              name={provider.name}
              shortName={provider.shortName}
              color={provider.color}
              subtitle={provider.category}
              shortNameTextSize="lg"
              isSelected={selectedProvider.name === provider.name}
              onSelect={() => chooseProvider(provider)}
            />
          ))}
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[28px] border border-border bg-card p-5 md:p-8">
          <p className="text-sm font-medium text-muted-foreground">
            {selectedProvider.name} plans
          </p>
          <h2 className="mt-1 font-heading text-2xl font-semibold">
            Select a plan
          </h2>
          <div className="mt-5 grid gap-2 sm:grid-cols-3">
            {selectedProvider.plans.map((plan, index) => (
              <motion.button
                key={plan.name}
                type="button"
                whileTap={{ scale: 0.96 }}
                onClick={() => setSelectedPlanIndex(index)}
                className={`rounded-2xl border p-4 text-left transition-colors ${selectedPlanIndex === index ? "border-primary bg-secondary text-primary" : "border-border hover:border-primary/40"}`}
                aria-pressed={selectedPlanIndex === index}
              >
                <span className="flex items-center justify-between gap-2 font-semibold">
                  {plan.name}
                  {selectedPlanIndex === index && <Check className="size-4" />}
                </span>
                <span className="mt-2 block text-xl font-semibold text-foreground">
                  ₦{formatAmount(plan.price)}
                </span>
                <span className="mt-1 block text-xs text-muted-foreground">
                  {plan.detail} · {plan.duration}
                </span>
              </motion.button>
            ))}
          </div>
          <label
            className="mt-7 block text-sm font-medium"
            htmlFor="subscription-account"
          >
            Account or smartcard number
            <span className="relative mt-2 block">
              <CreditCard className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                id="subscription-account"
                value={accountNumber}
                onChange={(event) => setAccountNumber(event.target.value)}
                placeholder="Enter your account number"
                className="h-12 w-full rounded-xl border border-input bg-background pl-10 pr-3 outline-none transition focus:border-primary focus:ring-3 focus:ring-primary/15"
              />
            </span>
          </label>
        </div>

        <aside className="flex flex-col justify-between rounded-[28px] border border-border bg-surface p-5 text-foreground shadow-[0_4px_24px_rgb(46_46_58_/_0.05)] md:p-8">
          <div>
            <p className="text-sm text-muted-foreground">Renewal preview</p>
            <p className="mt-3 font-heading text-3xl font-semibold">
              ₦{formatAmount(selectedPlan.price)}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              {selectedProvider.name} · {selectedPlan.name} ·{" "}
              {accountNumber || "Account number needed"}
            </p>
          </div>
          <Button
            type="button"
            size="lg"
            onClick={confirmSubscription}
            disabled={!accountNumber || pinOpen}
            className="mt-8 h-12 w-full rounded-full bg-primary text-primary-foreground hover:bg-primary-hover"
          >
            Confirm renewal
          </Button>
        </aside>
      </section>

      <PinModal
        open={pinOpen}
        onOpenChange={setPinOpen}
        onSuccess={() =>
          toast.success("Subscription renewal ready", {
            description: `Mock ${selectedProvider.name} renewal prepared.`,
          })
        }
        title="Confirm subscription renewal"
        amount={`₦${formatAmount(selectedPlan.price)}`}
      />
    </div>
  );
}
