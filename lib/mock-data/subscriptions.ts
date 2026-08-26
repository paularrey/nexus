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

export const subscriptionData = {
  providers: [
    {
      name: "Netflix",
      shortName: "N",
      category: "Streaming",
      color: "#e50914",
      plans: [
        {
          name: "Mobile",
          price: 2500,
          duration: "30 days",
          detail: "1 screen",
        },
        {
          name: "Standard",
          price: 5500,
          duration: "30 days",
          detail: "2 screens",
        },
        {
          name: "Premium",
          price: 8500,
          duration: "30 days",
          detail: "4 screens",
        },
      ],
    },
    {
      name: "Showmax",
      shortName: "S",
      category: "Streaming",
      color: "#0f172a",
      plans: [
        {
          name: "Mobile",
          price: 1200,
          duration: "30 days",
          detail: "Mobile viewing",
        },
        {
          name: "Entertainment",
          price: 3200,
          duration: "30 days",
          detail: "All entertainment",
        },
        {
          name: "Pro",
          price: 5500,
          duration: "30 days",
          detail: "Sports included",
        },
      ],
    },
    {
      name: "Spotify",
      shortName: "S",
      category: "Music",
      color: "#1db954",
      plans: [
        {
          name: "Individual",
          price: 1300,
          duration: "30 days",
          detail: "1 Premium account",
        },
        {
          name: "Duo",
          price: 1800,
          duration: "30 days",
          detail: "2 Premium accounts",
        },
        {
          name: "Family",
          price: 2500,
          duration: "30 days",
          detail: "6 Premium accounts",
        },
      ],
    },
    {
      name: "DStv",
      shortName: "D",
      category: "Cable TV",
      color: "#0066b3",
      plans: [
        {
          name: "Access",
          price: 2000,
          duration: "30 days",
          detail: "Local channels",
        },
        {
          name: "Family",
          price: 4900,
          duration: "30 days",
          detail: "Family entertainment",
        },
        {
          name: "Compact",
          price: 12500,
          duration: "30 days",
          detail: "Premium channels",
        },
      ],
    },
    {
      name: "GOtv",
      shortName: "G",
      category: "Cable TV",
      color: "#f28c28",
      plans: [
        {
          name: "Smallie",
          price: 1300,
          duration: "30 days",
          detail: "Local favourites",
        },
        {
          name: "Jolli",
          price: 2700,
          duration: "30 days",
          detail: "Family channels",
        },
        {
          name: "Max",
          price: 4850,
          duration: "30 days",
          detail: "More entertainment",
        },
      ],
    },
    {
      name: "Startimes",
      shortName: "ST",
      category: "Cable TV",
      color: "#c8102e",
      plans: [
        {
          name: "Nova",
          price: 1200,
          duration: "30 days",
          detail: "Essential channels",
        },
        {
          name: "Basic",
          price: 2600,
          duration: "30 days",
          detail: "Family channels",
        },
        {
          name: "Classic",
          price: 3600,
          duration: "30 days",
          detail: "Entertainment pack",
        },
      ],
    },
  ] satisfies SubscriptionProvider[],
};
