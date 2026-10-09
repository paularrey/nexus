import { Droplet, Tv, Zap } from "lucide-react";

import type { Biller, CableProvider, Disco } from "@/types";

export const billsData = {
  billers: [
    {
      slug: "electricity",
      name: "Electricity",
      shortName: "EK",
      description: "Prepaid & postpaid meters",
      color: "#155eef",
      identifierLabel: "Meter number",
      icon: Zap,
    },
    {
      slug: "cable-tv",
      name: "Cable TV",
      shortName: "TV",
      description: "Subscription renewal",
      color: "#f79009",
      identifierLabel: "Smartcard number",
      icon: Tv,
    },
    {
      slug: "water",
      name: "Water",
      shortName: "W",
      description: "Utility payment",
      color: "#12b76a",
      identifierLabel: "Customer number",
      icon: Droplet,
    },
  ] satisfies Biller[],
  discos: [
    { id: "ikedc", name: "IKEDC — Ikeja Electric" },
    { id: "ekedc", name: "EKEDC — Eko Electricity" },
    { id: "aedc", name: "AEDC — Abuja Electricity" },
    { id: "ibedc", name: "IBEDC — Ibadan Electricity" },
    { id: "phed", name: "PHED — Port Harcourt Electricity" },
    { id: "eedc", name: "EEDC — Enugu Electricity" },
    { id: "bedc", name: "BEDC — Benin Electricity" },
    { id: "kedco", name: "KEDCO — Kano Electricity" },
    { id: "kaedco", name: "KAEDCO — Kaduna Electricity" },
    { id: "jed", name: "JED — Jos Electricity" },
    { id: "yedc", name: "YEDC — Yola Electricity" },
    { id: "aple", name: "APLE — Aba Power Limited" },
  ] satisfies Disco[],
  cableProviders: [
    { name: "DStv", shortName: "DStv", color: "#0066b3" },
    { name: "GOtv", shortName: "GOtv", color: "#f28c28" },
    { name: "Startimes", shortName: "STV", color: "#c8102e" },
  ] satisfies CableProvider[],
  amounts: [2000, 5000, 10000, 20000, 50000],
  serviceFee: 100,
};

export function getBillerBySlug(slug: string): Biller | undefined {
  return billsData.billers.find((biller) => biller.slug === slug);
}
