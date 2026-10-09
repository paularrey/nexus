"use client";

import { AnimatePresence, motion } from "framer-motion";
import { FileCheck2, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { use, useMemo, useState } from "react";
import { toast } from "sonner";

import { PinModal } from "@/components/payments/PinModal";
import { AmountPresets } from "@/components/ui/AmountPresets";
import { BackLink } from "@/components/ui/BackLink";
import { Button } from "@/components/ui/Button";
import { CardSection } from "@/components/ui/CardSection";
import { EmptyState } from "@/components/ui/EmptyState";
import { FeeBreakdown } from "@/components/ui/FeeBreakdown";
import { PageHeader } from "@/components/ui/PageHeader";
import { SegmentedToggle } from "@/components/ui/SegmentedToggle";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SuccessBanner } from "@/components/ui/SuccessBanner";
import { useMockVerification } from "@/lib/hooks/useMockVerification";
import { usePinFlow } from "@/lib/hooks/usePinFlow";
import { billsData, getBillerBySlug } from "@/lib/mock-data/bills";
import { formatNaira } from "@/lib/utils/format";
import type { BillPageProps, Biller, MeterType } from "@/types";

function generateMeterToken() {
  return Array.from({ length: 4 }, () =>
    Math.floor(10000 + Math.random() * 90000),
  ).join(" ");
}

function BillerForm({ biller }: { biller: Biller }) {
  const isElectricity = biller.slug === "electricity";
  const isCableTv = biller.slug === "cable-tv";

  const [discoId, setDiscoId] = useState(billsData.discos[0].id);
  const [meterType, setMeterType] = useState<MeterType>("prepaid");
  const [cableProviderName, setCableProviderName] = useState(
    billsData.cableProviders[0].name,
  );
  const [identifier, setIdentifier] = useState("");
  const [amount, setAmount] = useState(5000);
  const [meterToken, setMeterToken] = useState<string | null>(null);
  const { pinOpen, setPinOpen, openPin } = usePinFlow();
  const { isVerifying, isVerified, verify, reset } = useMockVerification();

  const disco = useMemo(
    () => billsData.discos.find((item) => item.id === discoId),
    [discoId],
  );
  const cableProvider = useMemo(
    () =>
      billsData.cableProviders.find((item) => item.name === cableProviderName),
    [cableProviderName],
  );

  const totalAmount = amount + billsData.serviceFee;
  const serviceDetail =
    isElectricity && disco
      ? `${disco.name} · ${meterType === "prepaid" ? "Prepaid" : "Postpaid"}`
      : isCableTv && cableProvider
        ? cableProvider.name
        : biller.name;

  const verifyCustomer = () => {
    verify(Boolean(identifier.trim()), {
      title: "Demo customer verified",
      description: `${biller.name} lookup is simulated for this UI preview.`,
    });
  };

  const handlePaymentSuccess = () => {
    if (isElectricity && meterType === "prepaid") {
      const token = generateMeterToken();
      setMeterToken(token);
      toast.success("Meter token generated", {
        description: `Mock units purchase from ${disco?.name ?? biller.name}.`,
      });
      return;
    }
    toast.success("Bill payment ready", {
      description: `Mock ${biller.name.toLowerCase()} payment prepared.`,
    });
  };

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">
      <BackLink href="/bills">All bills</BackLink>
      <PageHeader
        eyebrow="Bills & utilities"
        title={biller.name}
        lede={
          isElectricity
            ? "Choose your DisCo and meter type, then enter the meter number."
            : isCableTv
              ? "Select your TV provider and enter the smartcard number."
              : "Enter your water customer number to continue."
        }
      />

      <section className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <CardSection>
          {isElectricity && (
            <>
              <label className="block text-sm font-medium" htmlFor="disco-select">
                Electricity provider (DisCo)
              </label>
              <Select
                value={discoId}
                onValueChange={(value) => {
                  setDiscoId(value);
                  reset();
                }}
              >
                <SelectTrigger
                  id="disco-select"
                  className="mt-2 h-12 w-full rounded-xl"
                >
                  <SelectValue placeholder="Select a DisCo" />
                </SelectTrigger>
                <SelectContent>
                  {billsData.discos.map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="mt-6">
                <p className="text-sm font-medium">Meter type</p>
                <SegmentedToggle
                  className="mt-2"
                  options={["prepaid", "postpaid"] as const}
                  value={meterType}
                  onChange={(value) => {
                    setMeterType(value);
                    setMeterToken(null);
                  }}
                />
                <p className="mt-2 text-xs text-muted-foreground">
                  {meterType === "prepaid"
                    ? "Buy units for a prepaid meter — a token is generated after payment."
                    : "Settle the monthly bill for a postpaid meter."}
                </p>
              </div>
            </>
          )}

          {isCableTv && (
            <label
              className="block text-sm font-medium"
              htmlFor="cable-provider-select"
            >
              TV provider
              <Select
                value={cableProviderName}
                onValueChange={(value) => {
                  setCableProviderName(value);
                  reset();
                }}
              >
                <SelectTrigger
                  id="cable-provider-select"
                  className="mt-2 h-12 w-full rounded-xl"
                >
                  <SelectValue placeholder="Select a provider" />
                </SelectTrigger>
                <SelectContent>
                  {billsData.cableProviders.map((item) => (
                    <SelectItem key={item.name} value={item.name}>
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </label>
          )}

          <div className={`${isElectricity || isCableTv ? "mt-8" : ""}`}>
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Customer lookup
                </p>
                <h2 className="mt-1 font-heading text-xl font-semibold">
                  Verify before paying
                </h2>
              </div>
              <FileCheck2 className="size-6 shrink-0 text-primary" />
            </div>
            <label
              className="mt-6 block text-sm font-medium"
              htmlFor="bill-identifier"
            >
              {biller.identifierLabel}
              <span className="mt-2 flex flex-col gap-2 sm:flex-row">
                <input
                  id="bill-identifier"
                  type="text"
                  inputMode="numeric"
                  value={identifier}
                  onChange={(event) => {
                    setIdentifier(event.target.value);
                    reset();
                  }}
                  placeholder={`Enter ${biller.identifierLabel.toLowerCase()}`}
                  className="h-12 min-w-0 flex-1 rounded-xl border border-input bg-background px-3 text-base outline-none transition focus:border-primary focus:ring-3 focus:ring-primary/15"
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
                    description={`Demo result for ${serviceDetail}`}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <AnimatePresence initial={false}>
            {meterToken && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-5 rounded-2xl border border-success/30 bg-success/5 p-4">
                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-success">
                    Meter token
                  </p>
                  <p className="mt-2 font-mono text-lg font-semibold tracking-[0.15em] text-foreground">
                    {meterToken}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {disco?.name} · {identifier}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-8">
            <p className="text-sm font-medium">
              {isElectricity && meterType === "prepaid"
                ? "Units value (Naira)"
                : "Payment amount"}
            </p>
            <AmountPresets
              amounts={billsData.amounts}
              value={amount}
              onChange={setAmount}
            />
          </div>
        </CardSection>

        <aside className="order-first rounded-[28px] border border-border bg-surface p-4 text-foreground shadow-[0_4px_24px_color-mix(in_srgb,var(--foreground)_6%,transparent)] md:p-6 lg:order-none lg:sticky lg:top-24 lg:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                Payment summary
              </p>
              <p className="mt-3 font-heading text-3xl font-semibold">
                {formatNaira(amount)}
              </p>
            </div>
            <div
              className="grid size-10 shrink-0 place-items-center rounded-xl text-white"
              style={{ backgroundColor: biller.color }}
            >
              <biller.icon className="size-5" />
            </div>
          </div>

          <div className="mt-5 rounded-2xl border border-border bg-surface-alt p-3">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Service</span>
              <span className="text-right font-medium text-foreground">
                {serviceDetail}
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
            disabled={!identifier || !isVerified || pinOpen}
            className="mt-6 h-12 w-full rounded-xl bg-primary text-primary-foreground hover:bg-primary-hover"
          >
            Pay Bill
          </Button>
        </aside>
      </section>

      <PinModal
        open={pinOpen}
        onOpenChange={setPinOpen}
        onSuccess={handlePaymentSuccess}
        title="Confirm bill payment"
        amount={formatNaira(totalAmount)}
      />
    </div>
  );
}

export default function BillCategoryPage({ params }: BillPageProps) {
  const { category } = use(params);
  const biller = getBillerBySlug(category);

  if (!biller) {
    return (
      <div className="mx-auto w-full max-w-2xl space-y-6">
        <BackLink href="/bills">All bills</BackLink>
        <EmptyState
          title="Bill type not found"
          description="Pick a service from the bills list to continue."
        >
          <Button asChild variant="outline" className="mt-6">
            <Link href="/bills">Back to bills</Link>
          </Button>
        </EmptyState>
      </div>
    );
  }

  return <BillerForm biller={biller} />;
}
