"use client";

import { motion } from "framer-motion";
import { Check, CreditCard, Tv } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { PinModal } from "@/components/PinModal";
import { useAuthGate } from "@/hooks/useAuthGate";
import {
  subscriptionData,
  type SubscriptionProvider,
} from "@/lib/mock-data/subscriptions";

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
          Keep your favourites running.
        </h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Choose a streaming, music, or cable provider and prepare a mock
          renewal.
        </p>
      </header>

      <section className="rounded-[28px] border border-border bg-card p-5 md:p-8">
        <div className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-xl bg-secondary text-primary">
            <Tv className="size-5" />
          </span>
          <div>
            <h2 className="font-heading text-xl font-semibold">
              Choose a provider
            </h2>
            <p className="text-sm text-muted-foreground">
              Select the subscription you want to renew.
            </p>
          </div>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {subscriptionData.providers.map((provider) => {
            const isSelected = selectedProvider.name === provider.name;
            return (
              <motion.button
                key={provider.name}
                type="button"
                whileTap={{ scale: 0.95 }}
                onClick={() => chooseProvider(provider)}
                className="relative flex min-h-28 flex-col items-start justify-between rounded-2xl border p-4 text-left transition-shadow"
                style={{
                  borderColor: isSelected ? provider.color : undefined,
                  boxShadow: isSelected
                    ? `0 0 0 3px ${provider.color}25, 0 12px 24px ${provider.color}22`
                    : undefined,
                }}
                aria-pressed={isSelected}
              >
                <span
                  className="grid size-10 place-items-center rounded-xl text-lg font-bold text-white"
                  style={{ backgroundColor: provider.color }}
                >
                  {provider.shortName}
                </span>
                <span>
                  <span className="block font-semibold">{provider.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {provider.category}
                  </span>
                </span>
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
                  ₦{plan.price.toLocaleString("en-NG")}
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

        <aside className="flex flex-col justify-between rounded-[28px] bg-gradient-to-br from-[#c45a3c] to-[#e07a5f] p-5 text-white shadow-[0_4px_24px_rgba(224,122,95,0.25)] md:p-8">
          <div>
            <p className="text-sm text-white/60">Renewal preview</p>
            <p className="mt-3 font-heading text-3xl font-semibold">
              ₦{selectedPlan.price.toLocaleString("en-NG")}
            </p>
            <p className="mt-2 text-sm text-white/60">
              {selectedProvider.name} · {selectedPlan.name} ·{" "}
              {accountNumber || "Account number needed"}
            </p>
          </div>
          <Button
            type="button"
            size="lg"
            onClick={confirmSubscription}
            disabled={!accountNumber || pinOpen}
            className="mt-8 h-12 w-full bg-accent text-white hover:bg-accent/90"
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
        amount={`₦${selectedPlan.price.toLocaleString("en-NG")}`}
      />
    </div>
  );
}
