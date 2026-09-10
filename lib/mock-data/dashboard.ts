export type DashboardShortcut = {
  label: string;
  description: string;
  href: string;
  icon: "zap" | "bills" | "betting" | "gift" | "store" | "more";
  tone: "blue" | "orange" | "green" | "navy";
};

export const dashboardData = {
  balance: 248650,
  currency: "NGN",
  cardholder: "Ravecard member",
  cardNumber: "4821  ••••  ••••  9014",
  expiry: "09/28",
  ticker: [
    "All your everyday payments in one place",
    "Send, pay, and book without switching apps",
    "Your balance is always ready when you are",
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
