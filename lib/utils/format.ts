export function formatAmount(value: number): string {
  return new Intl.NumberFormat("en-NG", {
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatPhoneNumber(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  return digits.replace(
    /(\d{4})(\d{3})(\d{0,4})/,
    (_, first, second, third) =>
      [first, second, third].filter(Boolean).join(" "),
  );
}
