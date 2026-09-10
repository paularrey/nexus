export type GiftCardBrand = {
  slug: string;
  name: string;
  image: string;
  startingPrice: number; // TODO: Connect to real pricing
  denominations: number[]; // TODO: Connect to real denomination pricing
  category: string;
};

export const giftCardBrands: GiftCardBrand[] = [
  {
    slug: "amazon",
    name: "Amazon",
    image: "/amazongiftcard.png",
    startingPrice: 5000,
    denominations: [5000, 10000, 20000, 50000],
    category: "Shopping",
  },
  {
    slug: "apple",
    name: "Apple",
    image: "/applegiftcard.jpeg",
    startingPrice: 5000,
    denominations: [5000, 10000, 20000, 50000],
    category: "Digital",
  },
  {
    slug: "google-play",
    name: "Google Play",
    image: "/googleplaygiftcard.png",
    startingPrice: 3000,
    denominations: [3000, 5000, 10000, 20000],
    category: "Digital",
  },
  {
    slug: "razer",
    name: "Razer",
    image: "/razergiftcard.png",
    startingPrice: 5000,
    denominations: [5000, 10000, 20000, 50000],
    category: "Gaming",
  },
  {
    slug: "spotify",
    name: "Spotify",
    image: "/spotifygiftcard.png",
    startingPrice: 3000,
    denominations: [3000, 5000, 10000],
    category: "Music",
  },
  {
    slug: "steam",
    name: "Steam",
    image: "/steamgiftcard.png",
    startingPrice: 5000,
    denominations: [5000, 10000, 20000, 50000],
    category: "Gaming",
  },
];

export function getBrandBySlug(slug: string): GiftCardBrand | undefined {
  return giftCardBrands.find((b) => b.slug === slug);
}
