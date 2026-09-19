"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown, Phone, Smartphone } from "lucide-react";
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

const SERVICE_FEE = 50;

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
  const [feeOpen, setFeeOpen] = useState(false);
  const authGate = useAuthGate();

  const detectedNetwork = useMemo(() => {
    const digits = phone.replace(/\D/g, "");
    return airtimeData.networks.find((network) =>
      network.prefixes.some((prefix) => digits.startsWith(prefix)),
    );
  }, [phone]);

  const hasSelection = Boolean(selectedNetwork && amount);
  const totalAmount = amount + SERVICE_FEE;

  const buyAirtime = () => {
    authGate(() => {
      setPinOpen(true);
    });
  };

  return (
    <div className="mx-auto w-full max-w-2xl space-y-8">
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

      {/* ── Airtime / Data toggle ──────────────────── */}
      <div className="grid grid-cols-2 rounded-2xl bg-muted p-1">
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

      {/* ── Network selection ──────────────────────── */}
      <section>
        <div className="mb-4 flex items-center gap-3">
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
        <div className="grid grid-cols-4 gap-4">
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
                  className={`relative size-16 overflow-hidden rounded-full border-[2.5px] transition-all sm:size-20 ${
                    isSelected
                      ? "border-primary shadow-[0_0_0_4px_rgba(196,90,60,0.15)]"
                      : "border-border hover:border-primary/30"
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
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute inset-0 flex items-center justify-center bg-primary/30"
                    >
                      <Check className="size-5 text-white" />
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

      {/* ── Phone number ───────────────────────────── */}
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
              className="h-12 w-full rounded-xl border border-input bg-background pl-10 pr-3 outline-none transition focus:border-primary focus:ring-3 focus:ring-primary/15"
              required
            />
          </span>
        </label>
        <AnimatePresence>
          {detectedNetwork && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3 flex items-center gap-2 overflow-hidden text-sm text-success"
            >
              <span className="relative size-5 shrink-0 overflow-hidden rounded-full">
                <Image
                  src={detectedNetwork.image}
                  alt={detectedNetwork.name}
                  fill
                  className="object-cover"
                  sizes="20px"
                />
              </span>
              {detectedNetwork.name} number detected
            </motion.p>
          )}
        </AnimatePresence>
      </section>

      {/* ── Amount / Data plan ─────────────────────── */}
      <section>
        <p className="text-sm font-medium">
          {service === "airtime" ? "Amount" : "Choose a data plan"}
        </p>
        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
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
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setAmount(presetAmount);
                  if (typeof preset !== "number") setSelectedPlan(preset);
                }}
                className={`rounded-xl border px-4 py-3.5 text-left text-sm font-medium transition-all ${
                  isSelected
                    ? "border-primary bg-primary text-primary-foreground shadow-md"
                    : "border-border bg-card hover:border-primary/40"
                }`}
              >
                <span className="block">
                  {typeof preset === "number"
                    ? `₦${preset.toLocaleString("en-NG")}`
                    : preset.label}
                </span>
                {typeof preset !== "number" && (
                  <span
                    className={`mt-1 block text-xs ${isSelected ? "text-white/70" : "text-muted-foreground"}`}
                  >
                    ₦{preset.amount.toLocaleString("en-NG")} ·{" "}
                    {preset.validity}
                  </span>
                )}
              </motion.button>
            );
          })}
        </div>
      </section>

      {/* ── Desktop summary (hidden on mobile) ─────── */}
      {hasSelection && (
        <section className="hidden md:block">
          <div className="rounded-[28px] bg-[var(--gradient-cta)] p-6 text-white shadow-[0_4px_24px_rgba(196,90,60,0.25)]">
            <p className="text-sm text-white/60">Ready to top up</p>
            <p className="mt-3 font-heading text-3xl font-semibold">
              ₦{amount.toLocaleString("en-NG")}
            </p>
            <p className="mt-2 text-sm text-white/60">
              {selectedNetwork.name} ·{" "}
              {service === "data" ? selectedPlan.label : "Airtime"} ·{" "}
              {phone || "Phone number needed"}
            </p>

            <div className="mt-5 border-t border-white/15 pt-4">
              <button
                type="button"
                onClick={() => setFeeOpen((open) => !open)}
                className="flex w-full items-center justify-between text-sm text-white/70"
              >
                <span>Fee breakdown</span>
                <ChevronDown
                  className={`size-4 transition-transform ${feeOpen ? "rotate-180" : ""}`}
                />
              </button>
              <AnimatePresence initial={false}>
                {feeOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="space-y-2 pt-4 text-sm">
                      <div className="flex justify-between text-white/50">
                        <span>Airtime</span>
                        <span>
                          ₦{amount.toLocaleString("en-NG")}
                        </span>
                      </div>
                      <div className="flex justify-between text-white/50">
                        <span>Service fee</span>
                        <span>
                          ₦{SERVICE_FEE.toLocaleString("en-NG")}
                        </span>
                      </div>
                      <div className="flex justify-between font-semibold">
                        <span>Total</span>
                        <span>
                          ₦{totalAmount.toLocaleString("en-NG")}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Button
              type="button"
              size="lg"
              onClick={buyAirtime}
              disabled={!phone || pinOpen}
              className="mt-5 h-12 w-full bg-white text-primary hover:bg-white/90"
            >
              {service === "airtime" ? "Buy Airtime" : "Buy Data"}
            </Button>
          </div>
        </section>
      )}

      {/* ── Mobile sticky summary ──────────────────── */}
      <AnimatePresence>
        {hasSelection && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-x-0 bottom-20 z-30 border-t border-border bg-card/95 px-4 py-4 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] backdrop-blur md:hidden"
          >
            <div className="mx-auto flex items-center justify-between gap-4">
              <div className="min-w-0 flex-1">
                <p className="text-xs text-muted-foreground">Total</p>
                <p className="font-heading text-xl font-semibold">
                  ₦{totalAmount.toLocaleString("en-NG")}
                </p>
              </div>
              <Button
                type="button"
                size="lg"
                onClick={buyAirtime}
                disabled={!phone || pinOpen}
                className="h-12 shrink-0 bg-[var(--gradient-cta)] px-6 text-white shadow-[0_4px_16px_rgba(196,90,60,0.3)] hover:opacity-90"
              >
                {service === "airtime" ? "Buy Airtime" : "Buy Data"}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
        amount={`₦${totalAmount.toLocaleString("en-NG")}`}
      />
    </div>
  );
}
