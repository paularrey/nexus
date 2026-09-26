"use client";

import { AnimatePresence, motion } from "framer-motion";
import { FileCheck2, ReceiptText, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { PinModal } from "@/components/payments/PinModal";
import { AmountPresets } from "@/components/ui/AmountPresets";
import { Button } from "@/components/ui/Button";
import { CardSection } from "@/components/ui/CardSection";
import { FeeBreakdown } from "@/components/ui/FeeBreakdown";
import { PageHeader } from "@/components/ui/PageHeader";
import { ProviderCard } from "@/components/ui/ProviderCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SuccessBanner } from "@/components/ui/SuccessBanner";
import { useMockVerification } from "@/lib/hooks/useMockVerification";
import { usePinFlow } from "@/lib/hooks/usePinFlow";
import { billsData } from "@/lib/mock-data/bills";
import { formatNaira } from "@/lib/utils/format";
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
  const { pinOpen, setPinOpen, openPin } = usePinFlow();
  const { isVerifying, isVerified, verify, reset } = useMockVerification();

  const verifyCustomer = () => {
    verify(Boolean(identifier.trim()), {
      title: "Demo customer verified",
      description: `${selectedBiller.name} lookup is simulated for this UI preview.`,
    });
  };

  return (
    <div className="mx-auto w-full max-w-5xl space-y-8">
      <PageHeader
        eyebrow="Bills & utilities"
        title={labels.billsTitle}
        lede="Choose a service, verify a customer number, and review the mock fee."
      />

      <CardSection>
        <SectionHeader
          icon={ReceiptText}
          title="Choose a service"
          description="Available utility types for this preview."
        />
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {billsData.billers.map((biller) => (
            <ProviderCard
              key={biller.name}
              name={biller.name}
              shortName={biller.shortName}
              color={biller.color}
              subtitle={biller.description}
              isSelected={selectedBiller.name === biller.name}
              onSelect={() => {
                setSelectedBiller(biller);
                reset();
                setIdentifier("");
              }}
            />
          ))}
        </div>
      </CardSection>

      <section className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <CardSection>
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
                  reset();
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
                <SuccessBanner
                  icon={ShieldCheck}
                  title="Customer verified"
                  description={`Demo result for ${selectedBiller.name}`}
                />
              </motion.div>
            )}
          </AnimatePresence>
          <div className="mt-8">
            <p className="text-sm font-medium">Payment amount</p>
            <AmountPresets
              amounts={billsData.amounts}
              value={amount}
              onChange={setAmount}
            />
          </div>
        </CardSection>

        <aside className="order-first rounded-[28px] border border-border bg-surface p-4 text-foreground shadow-[0_4px_24px_rgb(15_23_42_/_0.06)] md:p-6 lg:order-none lg:sticky lg:top-24 lg:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                Payment summary
              </p>
              <p className="mt-3 font-heading text-3xl font-semibold">
                {formatNaira(amount)}
              </p>
            </div>
            <div className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary">
              <ReceiptText className="size-5" />
            </div>
          </div>

          <div className="mt-5 rounded-2xl border border-border bg-surface-alt p-3">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Service</span>
              <span className="font-medium text-foreground">
                {selectedBiller.name}
              </span>
            </div>
            <div className="mt-2 flex items-center justify-between text-sm text-muted-foreground">
              <span>Reference</span>
              <span className="font-medium text-foreground">
                {identifier || "Pending"}
              </span>
            </div>
          </div>

          <div className="mt-5 border-y border-border py-3">
            <FeeBreakdown
              rows={[
                {
                  label: "Service fee",
                  value: formatNaira(billsData.serviceFee),
                },
                {
                  label: "Total",
                  value: formatNaira(amount + billsData.serviceFee),
                  emphasis: "strong",
                },
              ]}
            />
          </div>
          <Button
            type="button"
            size="lg"
            onClick={openPin}
            disabled={!identifier || !isVerified || pinOpen}
            className="mt-6 h-12 w-full rounded-full bg-primary text-primary-foreground hover:bg-primary-hover"
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
        amount={formatNaira(amount)}
      />
    </div>
  );
}
