import { ShieldCheck } from "lucide-react";
import Image from "next/image";

import { CardSection } from "@/components/ui/CardSection";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { formatNaira } from "@/lib/utils/format";
import type { SubscriptionPlan, SubscriptionProvider } from "@/types";

type ConfirmStepProps = {
  provider: SubscriptionProvider;
  plan: SubscriptionPlan;
  paymentLabel: string;
  renewalDate: string;
  billingCycle?: string;
  accountLabel?: string;
  accountValue?: string;
  totalPrice?: number;
};

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 px-4 py-3">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="text-right text-sm font-medium text-foreground">
        {value}
      </dd>
    </div>
  );
}

export function ConfirmStep({
  provider,
  plan,
  paymentLabel,
  renewalDate,
  billingCycle,
  accountLabel,
  accountValue,
  totalPrice,
}: ConfirmStepProps) {
  return (
    <CardSection>
      <SectionHeader
        icon={ShieldCheck}
        title="Confirm your renewal"
        description="Check the details before we prepare the payment."
      />

      <div className="mt-6 flex items-center gap-3 rounded-2xl border border-border bg-background p-4">
        <span className="grid size-11 shrink-0 place-items-center overflow-hidden rounded-xl bg-muted">
          <Image
            src={provider.image}
            alt={`${provider.name} logo`}
            width={30}
            height={30}
            className="object-contain"
          />
        </span>
        <div className="min-w-0">
          <p className="font-semibold text-foreground">{provider.name}</p>
          <p className="text-xs text-muted-foreground">{provider.category}</p>
        </div>
      </div>

      <dl className="mt-4 divide-y divide-border rounded-2xl border border-border">
        <SummaryRow label="Plan" value={`${plan.name} · ${plan.detail}`} />
        <SummaryRow
          label="Billing cycle"
          value={billingCycle ?? plan.duration}
        />
        {accountLabel && accountValue && (
          <SummaryRow label={accountLabel} value={accountValue} />
        )}
        <SummaryRow label="Payment method" value={paymentLabel} />
        <SummaryRow label="Next renewal" value={renewalDate} />
      </dl>

      <div className="mt-4 flex items-center justify-between rounded-2xl bg-secondary p-4">
        <span className="font-medium text-secondary-foreground">
          Total to pay
        </span>
        <span className="font-heading text-xl font-bold text-primary">
          {formatNaira(totalPrice ?? plan.price)}
        </span>
      </div>
    </CardSection>
  );
}
