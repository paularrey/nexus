"use client";

import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { toast } from "sonner";

import { PinModal } from "@/components/payments/PinModal";
import { Button } from "@/components/ui/Button";
import { FeeBreakdown } from "@/components/ui/FeeBreakdown";
import { PageHeader } from "@/components/ui/PageHeader";
import { usePinFlow } from "@/lib/hooks/usePinFlow";
import { airtimeData } from "@/lib/mock-data/airtime";
import { formatNaira, formatPhoneNumber } from "@/lib/utils/format";

const SERVICE_FEE = 50;

export default function AirtimeSummaryPage() {
  return (
    <Suspense fallback={null}>
      <SummaryContent />
    </Suspense>
  );
}

function SummaryContent() {
  const searchParams = useSearchParams();
  const { pinOpen, setPinOpen, openPin } = usePinFlow();

  const service = searchParams.get("service") === "data" ? "data" : "airtime";
  const network = airtimeData.networks.find(
    (candidate) => candidate.name === searchParams.get("network"),
  );
  const digits = (searchParams.get("phone") ?? "").replace(/\D/g, "");
  const parsedAmount = Number.parseInt(searchParams.get("amount") ?? "", 10);
  const amount =
    Number.isFinite(parsedAmount) && parsedAmount > 0 ? parsedAmount : null;
  const plan =
    network && amount
      ? (network.dataPlans.find((candidate) => candidate.amount === amount) ??
        null)
      : null;

  const isValid = Boolean(network && amount && digits.length === 11);
  const totalAmount = amount ? amount + SERVICE_FEE : 0;
  const backHref = `/airtime${
    searchParams.toString() ? `?${searchParams.toString()}` : ""
  }`;

  return (
    <div className="mx-auto w-full max-w-[480px] space-y-6">
      <PageHeader
        eyebrow="Airtime & data"
        title="Transaction summary"
        lede="Review the details below, then confirm your purchase."
      />

      {!isValid || !network || !amount ? (
        <section className="rounded-[28px] border border-border bg-surface p-6 text-center text-foreground shadow-[0_4px_24px_color-mix(in_srgb,var(--foreground)_6%,transparent)]">
          <p className="font-heading text-xl font-semibold">
            Nothing to review
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            We couldn&apos;t find a valid airtime order. Go back and fill in
            the form first.
          </p>
          <Button
            asChild
            size="lg"
            className="mt-5 h-12 w-full rounded-xl bg-primary text-primary-foreground hover:bg-primary-hover"
          >
            <Link href="/airtime">Back to Airtime</Link>
          </Button>
        </section>
      ) : (
        <section>
          <div className="rounded-[28px] border border-border bg-surface p-6 text-foreground shadow-[0_4px_24px_color-mix(in_srgb,var(--foreground)_6%,transparent)]">
            <p className="text-sm text-muted-foreground">Ready to top up</p>
            <p className="mt-3 font-heading text-3xl font-semibold">
              {formatNaira(amount)}
            </p>

            <dl className="mt-5 space-y-3 border-t border-border pt-4 text-sm">
              <div className="flex items-center justify-between gap-4">
                <dt className="text-muted-foreground">Network provider</dt>
                <dd className="flex items-center gap-2 font-medium text-foreground">
                  <span className="relative size-5 shrink-0 overflow-hidden rounded-full border border-border">
                    <Image
                      src={network.image}
                      alt={network.name}
                      fill
                      className="object-cover"
                      sizes="20px"
                    />
                  </span>
                  {network.name}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="text-muted-foreground">Product type</dt>
                <dd className="text-right font-medium text-foreground">
                  {service === "airtime"
                    ? "Airtime"
                    : plan
                      ? `Data · ${plan.label} (${plan.validity})`
                      : "Data bundle"}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="text-muted-foreground">Phone number</dt>
                <dd className="font-medium text-foreground">
                  {formatPhoneNumber(digits)}
                </dd>
              </div>
            </dl>

            <div className="mt-4 border-t border-border pt-4">
              <FeeBreakdown
                rows={[
                  {
                    label: service === "airtime" ? "Airtime" : "Data plan",
                    value: formatNaira(amount),
                  },
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
              disabled={pinOpen}
              className="mt-5 h-12 w-full rounded-xl bg-primary text-primary-foreground hover:bg-primary-hover"
            >
              {service === "airtime" ? "Buy Airtime" : "Buy Data"}
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
        onSuccess={() =>
          toast.success("Purchase ready", {
            description: `Mock ${service} purchase for ${network?.name}.`,
          })
        }
        title={
          service === "airtime"
            ? "Confirm airtime purchase"
            : "Confirm data purchase"
        }
        amount={amount ? formatNaira(totalAmount) : undefined}
      />
    </div>
  );
}
