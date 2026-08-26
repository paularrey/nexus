export type Biller = {
  name: string;
  shortName: string;
  description: string;
  color: string;
  identifierLabel: string;
};

export const billsData = {
  billers: [
    {
      name: "Electricity",
      shortName: "EK",
      description: "Prepaid meter",
      color: "#155eef",
      identifierLabel: "Meter number",
    },
    {
      name: "Cable TV",
      shortName: "TV",
      description: "Subscription renewal",
      color: "#f79009",
      identifierLabel: "Smartcard number",
    },
    {
      name: "Water",
      shortName: "W",
      description: "Utility payment",
      color: "#12b76a",
      identifierLabel: "Customer number",
    },
  ] satisfies Biller[],
  amounts: [2000, 5000, 10000, 20000, 50000],
  serviceFee: 100,
};
