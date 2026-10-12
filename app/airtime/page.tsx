"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, Phone, Smartphone, X } from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { PinModal } from "@/components/payments/PinModal";
import { Button } from "@/components/ui/Button";
import { FeeBreakdown } from "@/components/ui/FeeBreakdown";
import { PageHeader } from "@/components/ui/PageHeader";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SegmentedToggle } from "@/components/ui/SegmentedToggle";
import { usePinFlow } from "@/lib/hooks/usePinFlow";
import { airtimeData } from "@/lib/mock-data/airtime";
import { formatNaira, formatPhoneNumber } from "@/lib/utils/format";
import {
  translations,
  usePreferences,
} from "@/lib/context/preferences-context";

const SERVICE_FEE = 50;

export default function AirtimePage() {
  const { language } = usePreferences();
  const labels = translations[language];
  const [service, setService] = useState<"airtime" | "data">("airtime");
  const [selectedNetwork, setSelectedNetwork] = useState(
    airtimeData.networks[0],
  );
  const [amount, setAmount] = useState(1000);
  const [selectedPlanAmount, setSelectedPlanAmount] = useState(
    airtimeData.networks[0].dataPlans[1].amount,
  );
  const [phone, setPhone] = useState("");
  const [networkTouched, setNetworkTouched] = useState(false);
  const [dismissedHintFor, setDismissedHintFor] = useState<string | null>(null);
  const { pinOpen, setPinOpen, openPin } = usePinFlow();

  const detectedNetwork = useMemo(() => {
    const digits = phone.replace(/\D/g, "");
    return airtimeData.networks.find((network) =>
      network.prefixes.some((prefix) => digits.startsWith(prefix)),
    );
  }, [phone]);

  const activeNetwork = !networkTouched && detectedNetwork
    ? detectedNetwork
    : selectedNetwork;
  const selectedPlan =
    activeNetwork.dataPlans.find((plan) => plan.amount === selectedPlanAmount) ??
    activeNetwork.dataPlans[1];

  const showSwitchHint = Boolean(
    detectedNetwork &&
      networkTouched &&
      detectedNetwork.name !== selectedNetwork.name &&
      dismissedHintFor !== detectedNetwork.name,
  );

  const hasSelection = Boolean(activeNetwork && amount);
  const totalAmount = amount + SERVICE_FEE;

  return (
    <div className="mx-auto w-full max-w-[480px] space-y-6">
      <PageHeader
        eyebrow="Airtime & data"
        title={labels.airtimeTitle}
        lede="Choose airtime or a data bundle, then enter a number and select a plan."
      />

      <SegmentedToggle
        options={["airtime", "data"] as const}
        value={service}
        onChange={setService}
      />

      <section>
        <SectionHeader
          icon={Smartphone}
          title="Choose a network"
          description="Available networks are shown below."
          className="mb-4 flex items-center gap-3"
        />
        <div className="grid grid-cols-4 gap-3">
          {airtimeData.networks.map((network) => {
            const isSelected = activeNetwork.name === network.name;
            return (
              <motion.button
                key={network.name}
                type="button"
                whileTap={{ scale: 0.93 }}
                onClick={() => {
                  setNetworkTouched(true);
                  setSelectedNetwork(network);
                }}
                className="relative flex flex-col items-center gap-2.5"
                aria-pressed={isSelected}
              >
                <span
                  className={`relative size-14 overflow-hidden rounded-full border-[2.5px] transition-all sm:size-16 ${
                    isSelected
                      ? "border-primary shadow-[0_0_0_4px_rgb(79_70_229_/_0.18)]"
                      : "border-border hover:border-primary/30"
                  }`}
                >
                  <Image
                    src={network.image}
                    alt={network.name}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                  {isSelected && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute inset-0 flex items-center justify-center bg-primary/30"
                    >
                      <Check className="size-5 text-primary-foreground" />
                    </motion.span>
                  )}
                </span>
                <span
                  className={`text-xs font-semibold ${
                    isSelected ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {network.name}
                </span>
              </motion.button>
            );
          })}
        </div>
      </section>

      <section>
        <label
          className="block text-sm font-medium"
          htmlFor="airtime-phone"
        >
          Phone number
          <span className="relative mt-2 block">
            <Phone className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              id="airtime-phone"
              type="tel"
              inputMode="numeric"
              value={phone}
              onChange={(event) =>
                setPhone(formatPhoneNumber(event.target.value))
              }
              placeholder="0803 123 4567"
              className="h-[52px] w-full rounded-xl border border-input bg-background pl-10 pr-12 text-base outline-none transition focus:border-primary focus:ring-3 focus:ring-primary/15"
              required
            />
            {detectedNetwork && (
              <span className="pointer-events-none absolute right-3 top-1/2 size-6 -translate-y-1/2 overflow-hidden rounded-full border border-border bg-background">
                <Image
                  src={detectedNetwork.image}
                  alt={detectedNetwork.name}
                  fill
                  className="object-cover"
                  sizes="24px"
                />
              </span>
            )}
          </span>
        </label>
        <AnimatePresence>
          {showSwitchHint && detectedNetwork && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3 overflow-hidden"
            >
              <div className="flex items-center gap-2 rounded-xl border border-primary/30 bg-primary/5 px-3 py-2.5">
                <span className="relative size-5 shrink-0 overflow-hidden rounded-full">
                  <Image
                    src={detectedNetwork.image}
                    alt={detectedNetwork.name}
                    fill
                    className="object-cover"
                    sizes="20px"
                  />
                </span>
                <p className="flex-1 text-sm text-foreground">
                  Looks like a {detectedNetwork.name} number —{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setNetworkTouched(true);
                      setSelectedNetwork(detectedNetwork);
                      setDismissedHintFor(detectedNetwork.name);
                    }}
                    className="font-semibold text-primary hover:underline"
                  >
                    switch?
                  </button>
                </p>
                <button
                  type="button"
                  onClick={() => setDismissedHintFor(detectedNetwork.name)}
                  aria-label="Dismiss network hint"
                  className="rounded-full p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <X className="size-4" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      <section>
        <p className="text-sm font-medium">
          {service === "airtime" ? "Amount" : "Choose a data plan"}
        </p>
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {(service === "airtime"
            ? airtimeData.amounts
            : activeNetwork.dataPlans
          ).map((preset) => {
            const presetAmount =
              typeof preset === "number" ? preset : preset.amount;
            const isSelected =
              service === "airtime"
                ? amount === presetAmount
                : selectedPlan.amount === presetAmount;
            return (
              <motion.button
                key={typeof preset === "number" ? preset : preset.label}
                type="button"
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setAmount(presetAmount);
                  if (typeof preset !== "number")
                    setSelectedPlanAmount(presetAmount);
                }}
                className={`rounded-xl border px-4 py-3.5 text-left text-sm font-medium transition-all ${
                  isSelected
                    ? "border-primary bg-primary text-primary-foreground shadow-md"
                    : "border-border bg-card hover:border-primary/40"
                }`}
              >
                <span className="block">
                  {typeof preset === "number"
                    ? formatNaira(preset)
                    : preset.label}
                </span>
                {typeof preset !== "number" && (
                  <span
                    className={`mt-1 block text-xs ${isSelected ? "text-primary-foreground/80" : "text-muted-foreground"}`}
                  >
                    {formatNaira(preset.amount)} · {preset.validity}
                  </span>
                )}
              </motion.button>
            );
          })}
        </div>
      </section>

      {hasSelection && (
        <section>
          <div className="rounded-[28px] border border-border bg-surface p-6 text-foreground shadow-[0_4px_24px_color-mix(in_srgb,var(--foreground)_6%,transparent)]">
            <p className="text-sm text-muted-foreground">Ready to top up</p>
            <p className="mt-3 font-heading text-3xl font-semibold">
              {formatNaira(amount)}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              {activeNetwork.name} ·{" "}
              {service === "data" ? selectedPlan.label : "Airtime"} ·{" "}
              {phone || "Phone number needed"}
            </p>

            <div className="mt-5 border-t border-border pt-4">
              <FeeBreakdown
                rows={[
                  { label: "Airtime", value: formatNaira(amount) },
                  {
                    label: "Service fee",
                    value: formatNaira(SERVICE_FEE),
                  },
                  {
                    label: "Total",
                    value: formatNaira(totalAmount),
                    emphasis: "strong",
                  },
                ]}
              />
            </div>

            <Button
              type="button"
              size="lg"
              onClick={openPin}
              disabled={!phone || pinOpen}
              className="mt-5 h-12 w-full rounded-xl bg-primary text-primary-foreground hover:bg-primary-hover"
            >
              {service === "airtime" ? "Buy Airtime" : "Buy Data"}
            </Button>
          </div>
        </section>
      )}

      <PinModal
        open={pinOpen}
        onOpenChange={setPinOpen}
        onSuccess={() =>
          toast.success("Purchase ready", {
            description: `Mock ${service} purchase for ${activeNetwork.name}.`,
          })
        }
        title={
          service === "airtime"
            ? "Confirm airtime purchase"
            : "Confirm data purchase"
        }
        amount={formatNaira(totalAmount)}
      />
    </div>
  );
}
