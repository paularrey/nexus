export type GiftCardBrandOption = {
  id: string;
  name: string;
  countryCode: string;
  category: string;
  color: string;
  value: string;
};

export const giftCardBrandOptions: GiftCardBrandOption[] = [
  {
    id: "us-amazon",
    name: "Amazon",
    countryCode: "US",
    category: "Shopping",
    color: "#f59e0b",
    value: "Amazon Gift Card",
  },
  {
    id: "us-itunes",
    name: "iTunes",
    countryCode: "US",
    category: "Digital",
    color: "#111827",
    value: "Apple Gift Card",
  },
  {
    id: "us-google",
    name: "Google Play",
    countryCode: "US",
    category: "Digital",
    color: "#16a34a",
    value: "Google Play",
  },
  {
    id: "us-steam",
    name: "Steam",
    countryCode: "US",
    category: "Gaming",
    color: "#1d4ed8",
    value: "Steam Wallet",
  },

  {
    id: "uk-amazon",
    name: "Amazon UK",
    countryCode: "GB",
    category: "Shopping",
    color: "#f59e0b",
    value: "Amazon Gift Card",
  },
  {
    id: "uk-argos",
    name: "Argos",
    countryCode: "GB",
    category: "Shopping",
    color: "#ef4444",
    value: "Argos Gift Card",
  },
  {
    id: "uk-spotify",
    name: "Spotify",
    countryCode: "GB",
    category: "Entertainment",
    color: "#22c55e",
    value: "Spotify Credit",
  },
  {
    id: "uk-apple",
    name: "Apple UK",
    countryCode: "GB",
    category: "Digital",
    color: "#111827",
    value: "Apple Gift Card",
  },

  {
    id: "ca-amazon",
    name: "Amazon Canada",
    countryCode: "CA",
    category: "Shopping",
    color: "#f59e0b",
    value: "Amazon Gift Card",
  },
  {
    id: "ca-spotify",
    name: "Spotify",
    countryCode: "CA",
    category: "Entertainment",
    color: "#22c55e",
    value: "Spotify Credit",
  },
  {
    id: "ca-google",
    name: "Google Play",
    countryCode: "CA",
    category: "Digital",
    color: "#16a34a",
    value: "Google Play",
  },

  {
    id: "de-amazon",
    name: "Amazon Germany",
    countryCode: "DE",
    category: "Shopping",
    color: "#f59e0b",
    value: "Amazon Gift Card",
  },
  {
    id: "de-google",
    name: "Google Play",
    countryCode: "DE",
    category: "Digital",
    color: "#16a34a",
    value: "Google Play",
  },
  {
    id: "de-spotify",
    name: "Spotify",
    countryCode: "DE",
    category: "Entertainment",
    color: "#22c55e",
    value: "Spotify Credit",
  },

  {
    id: "ng-amazon",
    name: "Amazon NG",
    countryCode: "NG",
    category: "Shopping",
    color: "#f59e0b",
    value: "Amazon Gift Card",
  },
  {
    id: "ng-apple",
    name: "Apple NG",
    countryCode: "NG",
    category: "Digital",
    color: "#111827",
    value: "Apple Gift Card",
  },
  {
    id: "ng-google",
    name: "Google Play",
    countryCode: "NG",
    category: "Digital",
    color: "#16a34a",
    value: "Google Play",
  },
  {
    id: "ng-spotify",
    name: "Spotify",
    countryCode: "NG",
    category: "Entertainment",
    color: "#22c55e",
    value: "Spotify Credit",
  },
];
