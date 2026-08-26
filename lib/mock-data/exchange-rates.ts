export type ExchangeRate = {
  from: string;
  to: string;
  rate: number;
  feePercent: number;
};

export const exchangeRates: ExchangeRate[] = [
  { from: "USD", to: "NGN", rate: 1560, feePercent: 0.04 },
  { from: "USD", to: "GBP", rate: 0.78, feePercent: 0.03 },
  { from: "USD", to: "EUR", rate: 0.92, feePercent: 0.03 },
  { from: "GBP", to: "NGN", rate: 2000, feePercent: 0.04 },
  { from: "EUR", to: "NGN", rate: 1700, feePercent: 0.04 },
  { from: "CAD", to: "NGN", rate: 1180, feePercent: 0.04 },
  { from: "USD", to: "CAD", rate: 1.36, feePercent: 0.03 },
  { from: "USD", to: "USD", rate: 1, feePercent: 0.02 },
  { from: "GBP", to: "USD", rate: 1.28, feePercent: 0.03 },
  { from: "EUR", to: "USD", rate: 1.09, feePercent: 0.03 },
  { from: "NGN", to: "USD", rate: 0.00064, feePercent: 0.02 },
  { from: "NGN", to: "NGN", rate: 1, feePercent: 0.02 },
];

export const getExchangeRate = (from: string, to: string) => {
  const direct = exchangeRates.find(
    (item) => item.from === from && item.to === to,
  );

  if (direct) return direct;

  const reverse = exchangeRates.find(
    (item) => item.from === to && item.to === from,
  );

  if (reverse) {
    return {
      from,
      to,
      rate: 1 / reverse.rate,
      feePercent: reverse.feePercent,
    };
  }

  return { from, to, rate: 1, feePercent: 0.04 };
};
