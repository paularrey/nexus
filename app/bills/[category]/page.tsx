"use client";

import { AnimatePresence, motion } from "framer-motion";
import { FileCheck2, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, use, useMemo, useState } from "react";
import { toast } from "sonner";

import { AmountPresets } from "@/components/ui/AmountPresets";
import { BackLink } from "@/components/ui/BackLink";
import { Button } from "@/components/ui/Button";
import { CardSection } from "@/components/ui/CardSection";
import { EmptyState } from "@/components/ui/EmptyState";
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
import { billsData, getBillerBySlug } from "@/lib/mock-data/bills";
import type { BillPageProps, Biller, MeterType } from "@/types";

function BillerForm({ biller }: { biller: Biller }) {
  const isElectricity = biller.slug === "electricity";
  const isCableTv = biller.slug === "cable-tv";

  const router = useRouter();
  const searchParams = useSearchParams();

  const restoredDisco =
    billsData.discos.find((item) => item.id === searchParams.get("disco")) ??
    billsData.discos[0];
  const restoredMeterType: MeterType =
    searchParams.get("meterType") === "postpaid" ? "postpaid" : "prepaid";
  const restoredProvider =
    billsData.cableProviders.find(
      (item) => item.name === searchParams.get("provider"),
    ) ?? billsData.cableProviders[0];
  const restoredIdentifier = searchParams.get("identifier") ?? "";
  const parsedAmount = Number.parseInt(searchParams.get("amount") ?? "", 10);
  const restoredAmount =
    Number.isFinite(parsedAmount) && parsedAmount > 0 ? parsedAmount : 5000;

  const [discoId, setDiscoId] = useState(restoredDisco.id);
  const [meterType, setMeterType] = useState<MeterType>(restoredMeterType);
  const [cableProviderName, setCableProviderName] = useState(
    restoredProvider.name,
  );
  const [identifier, setIdentifier] = useState(restoredIdentifier);
  const [amount, setAmount] = useState(restoredAmount);
  const [restoredVerified, setRestoredVerified] = useState(
    searchParams.get("verified") === "1",
  );
  const { isVerifying, isVerified, verify, reset } = useMockVerification();
  const verified = isVerified || restoredVerified;

  const disco = useMemo(
    () => billsData.discos.find((item) => item.id === discoId),
    [discoId],
  );
  const cableProvider = useMemo(
    () =>
      billsData.cableProviders.find((item) => item.name === cableProviderName),
    [cableProviderName],
  );

  const serviceDetail =
    isElectricity && disco
      ? `${disco.name} · ${meterType === "prepaid" ? "Prepaid" : "Postpaid"}`
      : isCableTv && cableProvider
        ? cableProvider.name
        : biller.name;

  const clearVerification = () => {
    reset();
    setRestoredVerified(false);
  };

  const verifyCustomer = () => {
    verify(Boolean(identifier.trim()), {
      title: "Demo customer verified",
      description: `${biller.name} lookup is simulated for this UI preview.`,
    });
  };

  const handleProceed = () => {
    const trimmedIdentifier = identifier.trim();
    if (!trimmedIdentifier) {
      toast.error(`Enter your ${biller.identifierLabel.toLowerCase()}`);
      return;
    }
    if (!verified) {
      toast.error("Verify your customer details first");
      return;
    }
    if (!amount || amount <= 0) {
      toast.error("Select an amount to continue");
      return;
    }
    const params = new URLSearchParams({
      amount: String(amount),
      identifier: trimmedIdentifier,
      verified: "1",
    });
    if (isElectricity && disco) {
      params.set("disco", disco.id);
      params.set("meterType", meterType);
    }
    if (isCableTv && cableProvider) {
      params.set("provider", cableProvider.name);
    }
    router.push(`/bills/${biller.slug}/summary?${params.toString()}`);
  };

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6">
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

      <section className="grid gap-5">
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
                  clearVerification();
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
                    clearVerification();
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
                  clearVerification();
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
                    clearVerification();
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
              {verified && (
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

        <Button
          type="button"
          size="lg"
          onClick={handleProceed}
          disabled={isVerifying}
          className="h-12 w-full rounded-xl bg-primary text-primary-foreground hover:bg-primary-hover"
        >
          Proceed
        </Button>
      </section>
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

  return (
    <Suspense fallback={null}>
      <BillerForm biller={biller} />
    </Suspense>
  );
}
