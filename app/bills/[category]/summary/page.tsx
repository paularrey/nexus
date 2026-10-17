"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, use } from "react";
import { toast } from "sonner";

import { PinModal } from "@/components/payments/PinModal";
import { BackLink } from "@/components/ui/BackLink";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { FeeBreakdown } from "@/components/ui/FeeBreakdown";
import { PageHeader } from "@/components/ui/PageHeader";
import { usePinFlow } from "@/lib/hooks/usePinFlow";
import { billsData, getBillerBySlug } from "@/lib/mock-data/bills";
import { formatNaira } from "@/lib/utils/format";
import type { BillPageProps } from "@/types";

function generateMeterToken() {
  return Array.from({ length: 4 }, () =>
    Math.floor(10000 + Math.random() * 90000),
  ).join(" ");
}

export default function BillSummaryPage({ params }: BillPageProps) {
  return (
    <Suspense fallback={null}>
      <BillSummaryContent params={params} />
    </Suspense>
  );
}

function BillSummaryContent({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = use(params);
  const biller = getBillerBySlug(category);
  const searchParams = useSearchParams();
  const { pinOpen, setPinOpen, openPin } = usePinFlow();

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

  const isElectricity = biller.slug === "electricity";
  const isCableTv = biller.slug === "cable-tv";

  const disco = billsData.discos.find(
    (item) => item.id === searchParams.get("disco"),
  );
  const cableProvider = billsData.cableProviders.find(
    (item) => item.name === searchParams.get("provider"),
  );
  const meterType =
    searchParams.get("meterType") === "postpaid" ? "postpaid" : "prepaid";
  const identifier = searchParams.get("identifier") ?? "";
  const parsedAmount = Number.parseInt(searchParams.get("amount") ?? "", 10);
  const amount =
    Number.isFinite(parsedAmount) && parsedAmount > 0 ? parsedAmount : null;
  const verified = searchParams.get("verified") === "1";

  const isValid = Boolean(identifier && amount && verified);
  const totalAmount = amount ? amount + billsData.serviceFee : 0;
  const backHref = `/bills/${biller.slug}${
    searchParams.toString() ? `?${searchParams.toString()}` : ""
  }`;

  const providerDetail = isElectricity
    ? (disco?.name ?? "Unknown DisCo")
    : isCableTv
      ? (cableProvider?.name ?? "Unknown provider")
      : biller.name;

  const handlePaymentSuccess = () => {
    if (isElectricity && meterType === "prepaid") {
      const token = generateMeterToken();
      toast.success("Meter token generated", {
        description: `Mock units purchase from ${disco?.name ?? biller.name} for meter ${identifier}. Token: ${token}`,
      });
      return;
    }
    toast.success("Bill payment ready", {
      description: `Mock ${biller.name.toLowerCase()} payment prepared for ${identifier}.`,
    });
  };

  return (
    <div className="mx-auto w-full max-w-[480px] space-y-6">
      <BackLink href={backHref}>Back to {biller.name.toLowerCase()}</BackLink>
      <PageHeader
        eyebrow="Bills & utilities"
        title="Payment summary"
        lede="Review the details below, then confirm your payment."
      />

      {!isValid || !amount ? (
        <section className="rounded-[28px] border border-border bg-surface p-6 text-center text-foreground shadow-[0_4px_24px_color-mix(in_srgb,var(--foreground)_6%,transparent)]">
          <p className="font-heading text-xl font-semibold">
            Nothing to review
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            We couldn&apos;t find a valid bill payment. Go back and fill in the
            form first.
          </p>
          <Button
            asChild
            size="lg"
            className="mt-5 h-12 w-full rounded-xl bg-primary text-primary-foreground hover:bg-primary-hover"
          >
            <Link href={`/bills/${biller.slug}`}>Back to bill form</Link>
          </Button>
        </section>
      ) : (
        <section>
          <div className="rounded-[28px] border border-border bg-surface p-6 text-foreground shadow-[0_4px_24px_color-mix(in_srgb,var(--foreground)_6%,transparent)]">
            <div className="flex items-start justify-between gap-4">
              <p className="text-sm text-muted-foreground">Amount to pay</p>
              <div
                className="grid size-10 shrink-0 place-items-center rounded-xl text-white"
                style={{ backgroundColor: biller.color }}
              >
                <biller.icon className="size-5" />
              </div>
            </div>
            <p className="mt-1 font-heading text-3xl font-semibold">
              {formatNaira(amount)}
            </p>

            <dl className="mt-5 space-y-3 border-t border-border pt-4 text-sm">
              <div className="flex items-center justify-between gap-4">
                <dt className="text-muted-foreground">Provider</dt>
                <dd className="text-right font-medium text-foreground">
                  {providerDetail}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="text-muted-foreground">
                  {biller.identifierLabel}
                </dt>
                <dd className="font-medium text-foreground">{identifier}</dd>
              </div>
              {isElectricity && (
                <div className="flex items-center justify-between gap-4">
                  <dt className="text-muted-foreground">Meter type</dt>
                  <dd className="font-medium capitalize text-foreground">
                    {meterType}
                  </dd>
                </div>
              )}
            </dl>

            <div className="mt-4 border-t border-border pt-4">
              <FeeBreakdown
                rows={[
                  {
                    label: isElectricity && meterType === "prepaid"
                      ? "Units value"
                      : biller.name,
                    value: formatNaira(amount),
                  },
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
              disabled={pinOpen}
              className="mt-5 h-12 w-full rounded-xl bg-primary text-primary-foreground hover:bg-primary-hover"
            >
              Pay Bill
            </Button>
            <Button
              asChild
              variant="ghost"
              size="lg"
              className="mt-2 h-11 w-full gap-2 text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <Link href={backHref}>
                <ArrowLeft className="size-4" data-icon="inline-start" />
                Back to edit details
              </Link>
            </Button>
          </div>
        </section>
      )}

      <PinModal
        open={pinOpen}
        onOpenChange={setPinOpen}
        onSuccess={handlePaymentSuccess}
        title="Confirm bill payment"
        amount={amount ? formatNaira(totalAmount) : undefined}
      />
    </div>
  );
}
