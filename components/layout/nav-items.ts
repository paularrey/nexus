import type { LucideIcon } from "lucide-react";
import {
  Clock,
  House,
  ReceiptText,
  Tv,
  UserRound,
  Zap,
} from "lucide-react";

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

export const navItems: NavItem[] = [
  { label: "Home", href: "/", icon: House },
  { label: "Airtime & Data", href: "/airtime", icon: Zap },
  { label: "Bills", href: "/bills", icon: ReceiptText },
  { label: "History", href: "/history", icon: Clock },
  { label: "Profile", href: "/profile", icon: UserRound },
  { label: "Subscriptions", href: "/subscriptions", icon: Tv },
];
