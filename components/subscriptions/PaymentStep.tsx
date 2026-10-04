import { Check, CreditCard, Wallet } from "lucide-react";

import { CardSection } from "@/components/ui/CardSection";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { cn } from "@/lib/utils";
import { formatNaira } from "@/lib/utils/format";

export type PaymentMethod = "wallet" | "card";

type PaymentStepProps = {
  value: PaymentMethod | null;
  onChange: (method: PaymentMethod) => void;
  amount: number;
  walletBalance: number;
  cardNumber: string;
  cardExpiry: string;
};

export function PaymentStep({
  value,
  onChange,
  amount,
  walletBalance,
  cardNumber,
  cardExpiry,
}: PaymentStepProps) {
  const walletShort = walletBalance < amount;
  const options = [
    {
      key: "wallet" as const,
      title: "Ravecard Wallet",
      description: walletShort
        ? "Not enough balance for this renewal"
        : "Pay straight from your balance",
      value: formatNaira(walletBalance),
      icon: Wallet,
      disabled: walletShort,
    },
    {
      key: "card" as const,
      title: "Saved card",
      description: `${cardNumber} · ${cardExpiry}`,
      value: undefined,
      icon: CreditCard,
      disabled: false,
    },
  ];

  return (
    <CardSection>
      <SectionHeader
        icon={CreditCard}
        title="Choose how to pay"
        description="Pick a payment method for this renewal."
      />
      <div
        className="mt-6 grid gap-3"
        role="radiogroup"
        aria-label="Payment method"
      >
        {options.map((option) => {
          const selected = value === option.key;
          const Icon = option.icon;
          return (
            <button
              key={option.key}
              type="button"
              role="radio"
              aria-checked={selected}
              disabled={option.disabled}
              onClick={() => onChange(option.key)}
              className={cn(
                "flex items-center gap-3 rounded-2xl border p-4 text-left transition-colors",
                selected
                  ? "border-primary bg-secondary"
                  : "border-border hover:border-primary/40",
                option.disabled && "opacity-50",
              )}
            >
              <span
                className={cn(
                  "grid size-10 shrink-0 place-items-center rounded-xl",
                  selected
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-primary",
                )}
              >
                <Icon className="size-5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-semibold text-foreground">
                  {option.title}
                </span>
                <span className="block text-xs text-muted-foreground">
                  {option.description}
                </span>
              </span>
              {option.value && (
                <span className="hidden shrink-0 text-sm text-muted-foreground sm:block">
                  {option.value}
                </span>
              )}
              {selected && (
                <Check className="size-4 shrink-0 text-primary" />
              )}
            </button>
          );
        })}
      </div>
      <p className="mt-4 text-xs text-muted-foreground">
        Paying {formatNaira(amount)} · Mock checkout — no real charge is made.
      </p>
    </CardSection>
  );
}
