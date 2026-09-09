"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  Check,
  ChevronDown,
  FileCheck2,
  ReceiptText,
  ShieldCheck,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { PinModal } from "@/components/PinModal";
import { useAuthGate } from "@/hooks/useAuthGate";
import { billsData } from "@/lib/mock-data/bills";
import {
  translations,
  usePreferences,
} from "@/lib/context/preferences-context";

export default function BillsPage() {
  const { language } = usePreferences();
  const labels = translations[language];
  const [selectedBiller, setSelectedBiller] = useState(billsData.billers[0]);
  const [identifier, setIdentifier] = useState("");
  const [amount, setAmount] = useState(5000);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [feeOpen, setFeeOpen] = useState(false);
  const [pinOpen, setPinOpen] = useState(false);
  const authGate = useAuthGate();

  const verifyCustomer = () => {
    if (!identifier.trim()) return;
    setIsVerifying(true);
    setIsVerified(false);
    window.setTimeout(() => {
      setIsVerifying(false);
      setIsVerified(true);
      toast.success("Demo customer verified", {
        description: `${selectedBiller.name} lookup is simulated for this UI preview.`,
      });
    }, 700);
  };

  const payBill = () => {
    authGate(() => {
      setPinOpen(true);
    });
  };

  return (
    <div className="mx-auto w-full max-w-5xl space-y-8">
      <header>
        <p className="text-sm font-medium text-primary">Bills & utilities</p>
        <h1 className="mt-1 font-heading text-3xl font-semibold tracking-tight md:text-4xl">
          {labels.billsTitle}
        </h1>
        <p className="mt-2 text-muted-foreground">
          Choose a service, verify a customer number, and review the mock fee.
        </p>
      </header>

      <section className="rounded-[28px] border border-border bg-card p-5 md:p-8">
        <div className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-xl bg-secondary text-primary">
            <ReceiptText className="size-5" />
          </span>
          <div>
            <h2 className="font-heading text-xl font-semibold">
              Choose a service
            </h2>
            <p className="text-sm text-muted-foreground">
              Available utility types for this preview.
            </p>
          </div>
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {billsData.billers.map((biller) => {
            const isSelected = selectedBiller.name === biller.name;
            return (
              <motion.button
                key={biller.name}
                type="button"
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setSelectedBiller(biller);
                  setIsVerified(false);
                  setIdentifier("");
                }}
                className="relative flex min-h-28 flex-col items-start justify-between rounded-2xl border p-4 text-left transition-shadow"
                style={{
                  borderColor: isSelected ? biller.color : undefined,
                  boxShadow: isSelected
                    ? `0 0 0 3px ${biller.color}25, 0 12px 24px ${biller.color}22`
                    : undefined,
                }}
                aria-pressed={isSelected}
              >
                <span
                  className="grid size-10 place-items-center rounded-xl text-sm font-bold text-white"
                  style={{ backgroundColor: biller.color }}
                >
                  {biller.shortName}
                </span>
                <span>
                  <span className="block font-semibold">{biller.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {biller.description}
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
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Customer lookup
              </p>
              <h2 className="mt-1 font-heading text-xl font-semibold">
                Verify before paying
              </h2>
            </div>
            <FileCheck2 className="size-6 text-primary" />
          </div>
          <label
            className="mt-6 block text-sm font-medium"
            htmlFor="bill-identifier"
          >
            {selectedBiller.identifierLabel}
            <span className="mt-2 flex flex-col gap-2 sm:flex-row">
              <input
                id="bill-identifier"
                type="text"
                value={identifier}
                onChange={(event) => {
                  setIdentifier(event.target.value);
                  setIsVerified(false);
                }}
                placeholder={`Enter ${selectedBiller.identifierLabel.toLowerCase()}`}
                className="h-12 min-w-0 flex-1 rounded-xl border border-input bg-background px-3 outline-none transition focus:border-primary focus:ring-3 focus:ring-primary/15"
              />
              <Button
                type="button"
                variant="secondary"
                onClick={verifyCustomer}
                disabled={!identifier.trim() || isVerifying}
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
                <div className="flex items-center gap-3 rounded-2xl border border-success/30 bg-success/10 p-4 text-success">
                  <ShieldCheck className="size-5" />
                  <div>
                    <p className="font-semibold">Customer verified</p>
                    <p className="text-sm text-success/80">
                      Demo result for {selectedBiller.name}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div className="mt-8">
            <p className="text-sm font-medium">Payment amount</p>
            <div className="mt-3 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
              {billsData.amounts.map((preset) => (
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

        <aside className="order-first rounded-[28px] bg-gradient-to-br from-[#c45a3c] to-[#e07a5f] p-4 text-white shadow-[0_4px_24px_rgba(224,122,95,0.25)] md:p-6 lg:order-none lg:sticky lg:top-24 lg:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-blue-100/65">
                Payment summary
              </p>
              <p className="mt-3 font-heading text-3xl font-semibold">
                ₦{amount.toLocaleString("en-NG")}
              </p>
            </div>
            <div className="grid size-10 place-items-center rounded-xl bg-white/8 text-orange-300">
              <ReceiptText className="size-5" />
            </div>
          </div>

          <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-3">
            <div className="flex items-center justify-between text-sm text-blue-100/80">
              <span>Service</span>
              <span className="font-medium text-white">
                {selectedBiller.name}
              </span>
            </div>
            <div className="mt-2 flex items-center justify-between text-sm text-blue-100/80">
              <span>Reference</span>
              <span className="font-medium text-white">
                {identifier || "Pending"}
              </span>
            </div>
          </div>

          <div className="mt-5 border-y border-white/10 py-3">
            <button
              type="button"
              onClick={() => setFeeOpen((open) => !open)}
              className="flex w-full items-center justify-between text-sm text-blue-100/80"
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
                    <div className="flex justify-between text-blue-100/65">
                      <span>Service fee</span>
                      <span>
                        ₦{billsData.serviceFee.toLocaleString("en-NG")}
                      </span>
                    </div>
                    <div className="flex justify-between font-semibold">
                      <span>Total</span>
                      <span>
                        ₦
                        {(amount + billsData.serviceFee).toLocaleString(
                          "en-NG",
                        )}
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
            onClick={payBill}
            disabled={!identifier || !isVerified || pinOpen}
            className="mt-6 h-12 w-full rounded-2xl bg-accent text-white hover:bg-accent/90"
          >
            Pay Bill
          </Button>
        </aside>
      </section>
      <PinModal
        open={pinOpen}
        onOpenChange={setPinOpen}
        onSuccess={() =>
          toast.success("Bill payment ready", {
            description: `Mock ${selectedBiller.name.toLowerCase()} payment prepared.`,
          })
        }
        title="Confirm bill payment"
        amount={`₦${amount.toLocaleString("en-NG")}`}
      />
    </div>
  );
}
