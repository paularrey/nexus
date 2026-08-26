import type { LucideIcon } from "lucide-react";
import {
  House,
  ReceiptText,
  Tv,
  UserRound,
  WalletCards,
  Zap,
} from "lucide-react";

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

export const navItems: NavItem[] = [
  { label: "Home", href: "/", icon: House },
  { label: "Wallet", href: "/wallet", icon: WalletCards },
  { label: "Airtime & Data", href: "/airtime", icon: Zap },
  { label: "Bills", href: "/bills", icon: ReceiptText },
  { label: "Profile", href: "/profile", icon: UserRound },
  { label: "Subscriptions", href: "/subscriptions", icon: Tv },
];
