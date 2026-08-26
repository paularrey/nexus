export type GiftCardBrand = {
  name: string;
  category: string;
  color: string;
  value: string;
  rates: {
    USD: number;
    NGN: number;
    GBP: number;
    EUR: number;
  };
};

export type CurrencyCode = keyof GiftCardBrand["rates"];

export const giftCardData = {
  brands: [
    {
      name: "Apple",
      category: "Digital",
      color: "#111827",
      value: "Apple Gift Card",
      rates: {
        USD: 0.82,
        NGN: 1250,
        GBP: 0.68,
        EUR: 0.75,
      },
    },
    {
      name: "Amazon",
      category: "Shopping",
      color: "#f59e0b",
      value: "Amazon Gift Card",
      rates: {
        USD: 0.8,
        NGN: 1215,
        GBP: 0.66,
        EUR: 0.73,
      },
    },
    {
      name: "Steam",
      category: "Gaming",
      color: "#1d4ed8",
      value: "Steam Wallet",
      rates: {
        USD: 0.84,
        NGN: 1280,
        GBP: 0.71,
        EUR: 0.78,
      },
    },
    {
      name: "Google Play",
      category: "Digital",
      color: "#16a34a",
      value: "Google Play",
      rates: {
        USD: 0.79,
        NGN: 1190,
        GBP: 0.64,
        EUR: 0.7,
      },
    },
  ] satisfies GiftCardBrand[],
  currencies: [
    { code: "USD", symbol: "$", label: "US Dollar" },
    { code: "NGN", symbol: "₦", label: "Nigerian Naira" },
    { code: "GBP", symbol: "£", label: "British Pound" },
    { code: "EUR", symbol: "€", label: "Euro" },
  ] as const,
};
