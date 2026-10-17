"use client";

import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { toast } from "sonner";

import { PinModal } from "@/components/payments/PinModal";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/ui/PageHeader";
import { usePinFlow } from "@/lib/hooks/usePinFlow";
import { bettingData } from "@/lib/mock-data/betting";
import { formatNaira } from "@/lib/utils/format";

export default function BettingSummaryPage() {
  return (
    <Suspense fallback={null}>
      <SummaryContent />
    </Suspense>
  );
}

function SummaryContent() {
  const searchParams = useSearchParams();
  const { pinOpen, setPinOpen, openPin } = usePinFlow();

  const platform =
    bettingData.platforms.find(
      (candidate) => candidate.name === searchParams.get("platform"),
    ) ?? null;
  const userId = searchParams.get("userId")?.trim() ?? "";
  const parsedAmount = Number.parseInt(searchParams.get("amount") ?? "", 10);
  const amount =
    Number.isFinite(parsedAmount) && parsedAmount > 0 ? parsedAmount : null;
  const verified = searchParams.get("verified") === "1";

  const isValid = Boolean(platform && userId && amount && verified);
  const backHref = `/betting${
    searchParams.toString() ? `?${searchParams.toString()}` : ""
  }`;

  return (
    <div className="mx-auto w-full max-w-[480px] space-y-6">
      <PageHeader
        eyebrow="Betting wallet"
        title="Funding summary"
        lede="Review the details below, then confirm your funding."
      />

      {!isValid || !platform || !amount ? (
        <section className="rounded-[28px] border border-border bg-surface p-6 text-center text-foreground shadow-[0_4px_24px_color-mix(in_srgb,var(--foreground)_6%,transparent)]">
          <p className="font-heading text-xl font-semibold">
            Nothing to review
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            We couldn&apos;t find a valid funding request. Go back and fill in
            the form first.
          </p>
          <Button
            asChild
            size="lg"
            className="mt-5 h-12 w-full rounded-xl bg-primary text-primary-foreground hover:bg-primary-hover"
          >
            <Link href="/betting">Back to betting form</Link>
          </Button>
        </section>
      ) : (
        <section>
          <div className="rounded-[28px] border border-border bg-surface p-6 text-foreground shadow-[0_4px_24px_color-mix(in_srgb,var(--foreground)_6%,transparent)]">
            <div className="flex items-start justify-between gap-4">
              <p className="text-sm text-muted-foreground">Amount to fund</p>
              <span className="relative size-10 shrink-0 overflow-hidden rounded-full border-2 border-border bg-card">
                <Image
                  src={platform.image}
                  alt={platform.name}
                  fill
                  className="object-cover"
                  sizes="40px"
                />
              </span>
            </div>
            <p className="mt-1 font-heading text-3xl font-semibold">
              {formatNaira(amount)}
            </p>

            <dl className="mt-5 space-y-3 border-t border-border pt-4 text-sm">
              <div className="flex items-center justify-between gap-4">
                <dt className="text-muted-foreground">Platform</dt>
                <dd className="font-medium text-foreground">
                  {platform.name}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="text-muted-foreground">Player ID</dt>
                <dd className="font-medium text-foreground">{userId}</dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="text-muted-foreground">Account name</dt>
                <dd className="font-medium text-foreground">
                  {bettingData.mockAccountName}
                </dd>
              </div>
            </dl>

            <Button
              type="button"
              size="lg"
              onClick={openPin}
              disabled={pinOpen}
              className="mt-5 h-12 w-full rounded-xl bg-primary text-primary-foreground hover:bg-primary-hover"
            >
              Fund Betting Wallet
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
          toast.success("Funding request ready", {
            description: `Mock funding for ${platform?.name}.`,
          })
        }
        title="Confirm betting wallet funding"
        amount={amount ? formatNaira(amount) : undefined}
      />
    </div>
  );
}
