"use client";

import { ReceiptText } from "lucide-react";
import { useRouter } from "next/navigation";

import { CardSection } from "@/components/ui/CardSection";
import { PageHeader } from "@/components/ui/PageHeader";
import { ProviderCard } from "@/components/ui/ProviderCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { billsData } from "@/lib/mock-data/bills";
import {
  translations,
  usePreferences,
} from "@/lib/context/preferences-context";

export default function BillsPage() {
  const router = useRouter();
  const { language } = usePreferences();
  const labels = translations[language];

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6">
      <PageHeader
        eyebrow="Bills & utilities"
        title={labels.billsTitle}
        lede="Choose a service to open its bill payment form."
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
              key={biller.slug}
              name={biller.name}
              shortName={biller.shortName}
              color={biller.color}
              icon={biller.icon}
              subtitle={biller.description}
              isSelected={false}
              onSelect={() => router.push(`/bills/${biller.slug}`)}
            />
          ))}
        </div>
      </CardSection>
    </div>
  );
}
