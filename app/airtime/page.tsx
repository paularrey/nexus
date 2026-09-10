"use client";

import { motion } from "framer-motion";
import { Check, Phone, Smartphone } from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { PinModal } from "@/components/PinModal";
import { useAuthGate } from "@/hooks/useAuthGate";
import { airtimeData } from "@/lib/mock-data/airtime";
import {
  translations,
  usePreferences,
} from "@/lib/context/preferences-context";

const formatPhoneNumber = (value: string) => {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  return digits.replace(/(\d{4})(\d{3})(\d{0,4})/, (_, first, second, third) =>
    [first, second, third].filter(Boolean).join(" "),
  );
};

export default function AirtimePage() {
  const { language } = usePreferences();
  const labels = translations[language];
  const [service, setService] = useState<"airtime" | "data">("airtime");
  const [selectedNetwork, setSelectedNetwork] = useState(
    airtimeData.networks[0],
  );
  const [amount, setAmount] = useState(1000);
  const [selectedPlan, setSelectedPlan] = useState(
    airtimeData.networks[0].dataPlans[1],
  );
  const [phone, setPhone] = useState("");
  const [pinOpen, setPinOpen] = useState(false);
  const authGate = useAuthGate();

  const detectedNetwork = useMemo(() => {
    const digits = phone.replace(/\D/g, "");
    return airtimeData.networks.find((network) =>
      network.prefixes.some((prefix) => digits.startsWith(prefix)),
    );
  }, [phone]);

  const buyAirtime = () => {
    authGate(() => {
      setPinOpen(true);
    });
  };

  return (
    <div className="mx-auto w-full max-w-5xl space-y-8">
      <header>
        <p className="text-sm font-medium text-primary">Airtime & data</p>
        <h1 className="mt-1 font-heading text-3xl font-semibold tracking-tight md:text-4xl">
          {labels.airtimeTitle}
        </h1>
        <p className="mt-2 text-muted-foreground">
          Choose airtime or a data bundle, then enter a number and select a
          plan.
        </p>
      </header>

      <div className="grid grid-cols-2 rounded-2xl bg-muted p-1 sm:max-w-md">
        {(["airtime", "data"] as const).map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => setService(option)}
            className={`rounded-xl px-4 py-3 text-sm font-semibold capitalize transition-colors ${service === option ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
            aria-pressed={service === option}
          >
            {option}
          </button>
        ))}
      </div>

      <section className="rounded-[28px] border border-border bg-card p-5 md:p-8">
        <div className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-xl bg-secondary text-primary">
            <Smartphone className="size-5" />
          </span>
          <div>
            <h2 className="font-heading text-xl font-semibold">
              Choose a network
            </h2>
            <p className="text-sm text-muted-foreground">
              Available networks are shown below.
            </p>
          </div>
        </div>
        <div className="mt-6 grid grid-cols-4 gap-3 sm:max-w-md">
          {airtimeData.networks.map((network) => {
            const isSelected = selectedNetwork.name === network.name;
            return (
              <motion.button
                key={network.name}
                type="button"
                whileTap={{ scale: 0.93 }}
                onClick={() => {
                  setSelectedNetwork(network);
                  setSelectedPlan(network.dataPlans[1]);
                }}
                className="relative flex flex-col items-center gap-2.5"
                aria-pressed={isSelected}
              >
                <span
                  className={`relative size-16 overflow-hidden rounded-full border-2 transition-colors sm:size-20 ${
                    isSelected
                      ? "border-primary shadow-[0_0_0_3px_rgba(224,122,95,0.2)]"
                      : "border-border"
                  }`}
                >
                  <Image
                    src={network.image}
                    alt={network.name}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                  {isSelected && (
                    <span className="absolute inset-0 flex items-center justify-center bg-black/20">
                      <Check className="size-5 text-white" />
                    </span>
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

      <section className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[28px] border border-border bg-card p-5 md:p-8">
          <label className="block text-sm font-medium" htmlFor="airtime-phone">
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
                className="h-12 w-full rounded-xl border border-input bg-background pl-10 pr-3 outline-none transition focus:border-primary focus:ring-3 focus:ring-primary/15"
                required
              />
            </span>
          </label>
          {detectedNetwork && (
            <p className="mt-3 flex items-center gap-2 text-sm text-success">
              <span className="relative size-5 overflow-hidden rounded-full">
                <Image
                  src={detectedNetwork.image}
                  alt={detectedNetwork.name}
                  fill
                  className="object-cover"
                  sizes="20px"
                />
              </span>
              {detectedNetwork.name} number detected
            </p>
          )}
          <div className="mt-8">
            <p className="text-sm font-medium">
              {service === "airtime" ? "Amount" : "Choose a data plan"}
            </p>
            <div className="mt-3 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
              {(service === "airtime"
                ? airtimeData.amounts
                : selectedNetwork.dataPlans
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
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      setAmount(presetAmount);
                      if (typeof preset !== "number") setSelectedPlan(preset);
                    }}
                    className={`rounded-xl border px-3 py-3 text-left text-sm font-medium transition-colors ${isSelected ? "border-primary bg-secondary text-primary" : "border-border hover:border-primary/40"}`}
                  >
                    <span className="block">
                      {typeof preset === "number"
                        ? `₦${preset.toLocaleString("en-NG")}`
                        : preset.label}
                    </span>
                    {typeof preset !== "number" && (
                      <span className="mt-1 block text-xs text-muted-foreground">
                        ₦{preset.amount.toLocaleString("en-NG")} ·{" "}
                        {preset.validity}
                      </span>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </div>
        </div>

        <aside className="flex flex-col justify-between rounded-[28px] bg-gradient-to-br from-[#c45a3c] to-[#e07a5f] p-5 text-white shadow-[0_4px_24px_rgba(224,122,95,0.25)] md:p-8">
          <div>
            <p className="text-sm text-white/60">Ready to top up</p>
            <p className="mt-3 font-heading text-3xl font-semibold">
              ₦{amount.toLocaleString("en-NG")}
            </p>
            <p className="mt-2 text-sm text-white/60">
              {selectedNetwork.name} ·{" "}
              {service === "data" ? selectedPlan.label : "Airtime"} ·{" "}
              {phone || "Phone number needed"}
            </p>
          </div>
          <Button
            type="button"
            size="lg"
            onClick={buyAirtime}
            disabled={!phone || pinOpen}
            className="mt-8 h-12 w-full bg-accent text-white hover:bg-accent/90"
          >
            {service === "airtime" ? "Buy Airtime" : "Buy Data"}
          </Button>
        </aside>
      </section>
      <PinModal
        open={pinOpen}
        onOpenChange={setPinOpen}
        onSuccess={() =>
          toast.success("Purchase ready", {
            description: `Mock ${service} purchase for ${selectedNetwork.name}.`,
          })
        }
        title={
          service === "airtime"
            ? "Confirm airtime purchase"
            : "Confirm data purchase"
        }
        amount={`₦${amount.toLocaleString("en-NG")}`}
      />
    </div>
  );
}
