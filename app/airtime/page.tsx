"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, Phone, Smartphone, X } from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/ui/PageHeader";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SegmentedToggle } from "@/components/ui/SegmentedToggle";
import { airtimeData } from "@/lib/mock-data/airtime";
import { formatNaira, formatPhoneNumber } from "@/lib/utils/format";
import {
  translations,
  usePreferences,
} from "@/lib/context/preferences-context";

export default function AirtimePage() {
  return (
    <Suspense fallback={null}>
      <AirtimeForm />
    </Suspense>
  );
}

function AirtimeForm() {
  const { language } = usePreferences();
  const labels = translations[language];
  const router = useRouter();
  const searchParams = useSearchParams();

  const restoredNetwork =
    airtimeData.networks.find(
      (network) => network.name === searchParams.get("network"),
    ) ?? airtimeData.networks[0];
  const restoredService =
    searchParams.get("service") === "data" ? ("data" as const) : ("airtime" as const);
  const restoredPhone = formatPhoneNumber(searchParams.get("phone") ?? "");
  const parsedAmount = Number.parseInt(searchParams.get("amount") ?? "", 10);
  const restoredAmount =
    Number.isFinite(parsedAmount) && parsedAmount > 0 ? parsedAmount : 1000;

  const [service, setService] = useState<"airtime" | "data">(restoredService);
  const [selectedNetwork, setSelectedNetwork] = useState(restoredNetwork);
  const [amount, setAmount] = useState(restoredAmount);
  const [selectedPlanAmount, setSelectedPlanAmount] = useState(() =>
    restoredNetwork.dataPlans.some((plan) => plan.amount === restoredAmount)
      ? restoredAmount
      : restoredNetwork.dataPlans[1].amount,
  );
  const [phone, setPhone] = useState(restoredPhone);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [customAmount, setCustomAmount] = useState(() =>
    airtimeData.amounts.includes(restoredAmount) ? "" : String(restoredAmount),
  );
  const [networkTouched, setNetworkTouched] = useState(
    Boolean(searchParams.get("network")),
  );
  const [dismissedHintFor, setDismissedHintFor] = useState<string | null>(null);

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

  const customAmountError =
    customAmount !== "" && amount < 50
      ? "Minimum top-up amount is ₦50"
      : null;

  const handleCustomAmountChange = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 6);
    setCustomAmount(digits);
    setAmount(digits === "" ? 0 : Number.parseInt(digits, 10));
  };

  const handleProceed = () => {
    const digits = phone.replace(/\D/g, "");
    if (digits.length !== 11) {
      setPhoneError("Enter a valid 11-digit phone number");
      return;
    }
    if (amount < 50) {
      toast.error("Enter an amount of at least ₦50");
      return;
    }
    const params = new URLSearchParams({
      service,
      network: activeNetwork.name,
      phone: digits,
      amount: String(amount),
    });
    router.push(`/airtime/summary?${params.toString()}`);
  };

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
              onChange={(event) => {
                setPhone(formatPhoneNumber(event.target.value));
                setPhoneError(null);
              }}
              placeholder="0803 123 4567"
              aria-invalid={Boolean(phoneError)}
              className={`h-[52px] w-full rounded-xl border bg-background pl-10 pr-12 text-base outline-none transition focus:ring-3 ${
                phoneError
                  ? "border-danger focus:border-danger focus:ring-danger/15"
                  : "border-input focus:border-primary focus:ring-primary/15"
              }`}
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
        {phoneError && (
          <p className="mt-2 text-sm text-danger">{phoneError}</p>
        )}
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
                  setCustomAmount("");
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
        {service === "airtime" && (
          <div className="mt-4">
            <label
              className="block text-sm font-medium"
              htmlFor="airtime-custom-amount"
            >
              Custom amount
            </label>
            <span className="relative mt-2 block">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-muted-foreground">
                ₦
              </span>
              <input
                id="airtime-custom-amount"
                type="text"
                inputMode="numeric"
                value={customAmount}
                onChange={(event) =>
                  handleCustomAmountChange(event.target.value)
                }
                placeholder="e.g. 2500"
                aria-invalid={Boolean(customAmountError)}
                className={`h-[52px] w-full rounded-xl border bg-background pl-8 pr-3 text-base outline-none transition focus:ring-3 ${
                  customAmountError
                    ? "border-danger focus:border-danger focus:ring-danger/15"
                    : "border-input focus:border-primary focus:ring-primary/15"
                }`}
              />
            </span>
            {customAmountError && (
              <p className="mt-2 text-sm text-danger">{customAmountError}</p>
            )}
          </div>
        )}
      </section>

      <section>
        <Button
          type="button"
          size="lg"
          onClick={handleProceed}
          className="h-12 w-full rounded-xl bg-primary text-primary-foreground hover:bg-primary-hover"
        >
          Proceed
        </Button>
      </section>
    </div>
  );
}
