import type { DashboardShortcut } from "@/types";

export const dashboardData = {
  balance: 248650,
  currency: "NGN",
  cardholder: "Ravecard member",
  cardNumber: "4821  ••••  ••••  9014",
  expiry: "09/28",
  ticker: [
    "More than a card. It's your freedom.",
    "Send, pay, and book without switching apps",
    "Move money. Move freely.",
  ],
  shortcuts: [
    {
      label: "Airtime",
      description: "Top up a line",
      href: "/airtime",
      icon: "zap",
      tone: "orange",
    },
    {
      label: "Bills",
      description: "Pay utilities",
      href: "/bills",
      icon: "bills",
      tone: "green",
    },
    {
      label: "Betting",
      description: "Fund a wallet",
      href: "/betting",
      icon: "betting",
      tone: "orange",
    },
    {
      label: "Gift cards",
      description: "Buy or sell",
      href: "/gift-cards",
      icon: "gift",
      tone: "orange",
    },
    {
      label: "Bookings",
      description: "Book services",
      href: "/bookings",
      icon: "store",
      tone: "green",
    },
    {
      label: "Subscriptions",
      description: "Renew plans",
      href: "/subscriptions",
      icon: "more",
      tone: "blue",
    },
  ] satisfies DashboardShortcut[],
};
