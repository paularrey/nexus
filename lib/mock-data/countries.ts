export type Country = {
  code: string;
  name: string;
  flag: string;
  currency: string;
};

export const countries: Country[] = [
  { code: "US", name: "United States", flag: "🇺🇸", currency: "USD" },
  { code: "GB", name: "United Kingdom", flag: "🇬🇧", currency: "GBP" },
  { code: "CA", name: "Canada", flag: "🇨🇦", currency: "CAD" },
  { code: "DE", name: "Germany", flag: "🇩🇪", currency: "EUR" },
  { code: "FR", name: "France", flag: "🇫🇷", currency: "EUR" },
  { code: "NG", name: "Nigeria", flag: "🇳🇬", currency: "NGN" },
  { code: "GH", name: "Ghana", flag: "🇬🇭", currency: "GHS" },
  { code: "ZA", name: "South Africa", flag: "🇿🇦", currency: "ZAR" },
  { code: "AE", name: "United Arab Emirates", flag: "🇦🇪", currency: "AED" },
  { code: "IN", name: "India", flag: "🇮🇳", currency: "INR" },
  { code: "KE", name: "Kenya", flag: "🇰🇪", currency: "KES" },
  { code: "JP", name: "Japan", flag: "🇯🇵", currency: "JPY" },
  { code: "AU", name: "Australia", flag: "🇦🇺", currency: "AUD" },
  { code: "ES", name: "Spain", flag: "🇪🇸", currency: "EUR" },
  { code: "NL", name: "Netherlands", flag: "🇳🇱", currency: "EUR" },
  { code: "IT", name: "Italy", flag: "🇮🇹", currency: "EUR" },
  { code: "SE", name: "Sweden", flag: "🇸🇪", currency: "SEK" },
  { code: "BR", name: "Brazil", flag: "🇧🇷", currency: "BRL" },
  { code: "MX", name: "Mexico", flag: "🇲🇽", currency: "MXN" },
  { code: "SG", name: "Singapore", flag: "🇸🇬", currency: "SGD" },
];
