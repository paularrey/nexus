export type DashboardShortcut = {
  label: string;
  description: string;
  href: string;
  icon: "wallet" | "zap" | "bills" | "betting" | "gift" | "store" | "more";
  tone: "blue" | "orange" | "green" | "navy";
};

export const dashboardData = {
  balance: 248650,
  currency: "NGN",
  cardholder: "Nexus member",
  cardNumber: "4821  ••••  ••••  9014",
  expiry: "09/28",
  ticker: [
    "Keep your everyday payments in one place",
    "Explore your wallet shortcuts",
    "More features are coming to Nexus",
  ],
  shortcuts: [
    {
      label: "Wallet",
      description: "Move money",
      href: "/wallet",
      icon: "wallet",
      tone: "blue",
    },
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
      tone: "navy",
    },
    {
      label: "Gift cards",
      description: "Buy or sell",
      href: "/gift-cards",
      icon: "gift",
      tone: "orange",
    },
    {
      label: "Marketplace",
      description: "Book services",
      href: "/marketplace",
      icon: "store",
      tone: "green",
    },
    {
      label: "More",
      description: "See services",
      href: "/subscriptions",
      icon: "more",
      tone: "blue",
    },
  ] satisfies DashboardShortcut[],
};
