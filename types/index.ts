import type { LucideIcon } from "lucide-react";

export type AuthMode = "sign-in" | "create-account";

export type Language = "en" | "ig";

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

export type WalletTransaction = {
  id: string;
  title: string;
  description: string;
  amount: string;
  date: string;
  status: "Completed" | "Pending";
  reference: string;
};

export type DataPlan = {
  label: string;
  amount: number;
  validity: string;
};

export type Network = {
  name: string;
  shortName: string;
  color: string;
  image: string;
  prefixes: string[];
  dataPlans: DataPlan[];
};

export type BettingPlatform = {
  name: string;
  shortName: string;
  color: string;
};

export type Biller = {
  name: string;
  shortName: string;
  description: string;
  color: string;
  identifierLabel: string;
};

export type DashboardShortcut = {
  label: string;
  description: string;
  href: string;
  icon: "zap" | "bills" | "betting" | "gift" | "store" | "more";
  tone: "blue" | "orange" | "green" | "navy";
};

export type GiftCardBrand = {
  slug: string;
  name: string;
  image: string;
  startingPrice: number;
  denominations: number[];
  category: string;
};

export type CardType = "physical" | "ecode";

export type MarketplaceCategory =
  | "Hair"
  | "Nails"
  | "Spa"
  | "Cleaning"
  | "Home Repairs"
  | "Photography";

export type MarketplaceListing = {
  id: string;
  name: string;
  category: MarketplaceCategory;
  price: number;
  rating: number;
  reviews: number;
  location: string;
  description: string;
  image: string;
  availableSlots: string[];
};

export type NotificationItem = {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  icon: LucideIcon;
  tone: string;
  unread: boolean;
};

export type SubscriptionPlan = {
  name: string;
  price: number;
  duration: string;
  detail: string;
};

export type SubscriptionProvider = {
  name: string;
  shortName: string;
  category: string;
  color: string;
  plans: SubscriptionPlan[];
};

export type FeeBreakdownRow = {
  label: string;
  value: React.ReactNode;
  emphasis?: "muted" | "strong" | "strong-bordered";
  valueClassName?: string;
};

export type BrandPageProps = {
  params: Promise<{ brand: string }>;
};

export type BookingPageProps = {
  params: Promise<{ id: string }>;
};

export type ChildrenProps = {
  children: React.ReactNode;
};
