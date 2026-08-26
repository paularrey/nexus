import type { LucideIcon } from "lucide-react";
import { Bell, Gift, ShieldCheck, WalletCards, Zap } from "lucide-react";

export type NotificationItem = {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  icon: LucideIcon;
  tone: string;
  unread: boolean;
};

export const notifications: NotificationItem[] = [
  {
    id: "welcome",
    title: "Welcome to Nexus",
    description: "Your unified wallet is ready for everyday payments.",
    timestamp: "Just now",
    icon: Bell,
    tone: "text-primary bg-secondary",
    unread: true,
  },
  {
    id: "security",
    title: "Security reminder",
    description: "Add another layer of protection from your Profile settings.",
    timestamp: "Today, 9:42 AM",
    icon: ShieldCheck,
    tone: "text-success bg-success/10",
    unread: true,
  },
  {
    id: "gift-card",
    title: "Gift card rates updated",
    description: "Review the latest mock payout estimates in Gift Cards.",
    timestamp: "Yesterday",
    icon: Gift,
    tone: "text-accent bg-orange-50",
    unread: false,
  },
  {
    id: "wallet",
    title: "Wallet activity available",
    description: "Your recent wallet activity is ready to review.",
    timestamp: "Monday",
    icon: WalletCards,
    tone: "text-primary bg-secondary",
    unread: false,
  },
  {
    id: "airtime",
    title: "Quick top-up reminder",
    description: "Keep your line connected with a fast airtime or data top-up.",
    timestamp: "Sunday",
    icon: Zap,
    tone: "text-accent bg-orange-50",
    unread: false,
  },
];
