import type { LucideIcon } from "lucide-react";
import { House, UserRound } from "lucide-react";

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

export const navItems: NavItem[] = [
  { label: "Home", href: "/", icon: House },
  { label: "Profile", href: "/profile", icon: UserRound },
];
