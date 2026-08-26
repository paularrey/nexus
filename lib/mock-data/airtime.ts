export type Network = {
  name: string;
  shortName: string;
  color: string;
  prefixes: string[];
  dataPlans: DataPlan[];
};

export type DataPlan = {
  label: string;
  amount: number;
  validity: string;
};

export const airtimeData = {
  networks: [
    {
      name: "MTN",
      shortName: "MTN",
      color: "#f6c945",
      prefixes: [
        "0803",
        "0806",
        "0813",
        "0816",
        "0703",
        "0706",
        "0903",
        "0906",
      ],
      dataPlans: [
        { label: "1.5 GB", amount: 500, validity: "7 days" },
        { label: "3 GB", amount: 1000, validity: "14 days" },
        { label: "7 GB", amount: 2000, validity: "30 days" },
        { label: "12 GB", amount: 3000, validity: "30 days" },
      ],
    },
    {
      name: "Airtel",
      shortName: "A",
      color: "#e52b38",
      prefixes: ["0802", "0808", "0812", "0701", "0708", "0902", "0907"],
      dataPlans: [
        { label: "2 GB", amount: 500, validity: "14 days" },
        { label: "4.5 GB", amount: 1000, validity: "30 days" },
        { label: "10 GB", amount: 2000, validity: "30 days" },
        { label: "18 GB", amount: 3000, validity: "30 days" },
      ],
    },
    {
      name: "Glo",
      shortName: "G",
      color: "#75b843",
      prefixes: ["0805", "0807", "0811", "0815", "0705", "0905"],
      dataPlans: [
        { label: "2.5 GB", amount: 500, validity: "14 days" },
        { label: "5 GB", amount: 1000, validity: "30 days" },
        { label: "10.8 GB", amount: 2000, validity: "30 days" },
        { label: "20 GB", amount: 3000, validity: "30 days" },
      ],
    },
    {
      name: "9mobile",
      shortName: "9",
      color: "#8cc63f",
      prefixes: ["0809", "0817", "0818", "0908", "0909"],
      dataPlans: [
        { label: "2 GB", amount: 500, validity: "14 days" },
        { label: "4.5 GB", amount: 1000, validity: "30 days" },
        { label: "11 GB", amount: 2000, validity: "30 days" },
        { label: "24 GB", amount: 3000, validity: "30 days" },
      ],
    },
  ] satisfies Network[],
  amounts: [500, 1000, 2000, 5000, 10000],
};
