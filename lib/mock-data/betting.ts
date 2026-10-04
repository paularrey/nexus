import type { BettingPlatform } from "@/types";

export const bettingData = {
  platforms: [
    { name: "Bet9ja", shortName: "B9", color: "#f3b51b", image: "/bet9ja.png" },
    {
      name: "SportyBet",
      shortName: "S",
      color: "#e64b39",
      image: "/sportybet.png",
    },
    { name: "1xBet", shortName: "1X", color: "#1976d2", image: "/1xbet.png" },
    {
      name: "BetKing",
      shortName: "BK",
      color: "#1b9a59",
      image: "/betking.png",
    },
  ] satisfies BettingPlatform[],
  amounts: [1000, 2000, 5000, 10000, 20000],
  mockAccountName: "Ravecard demo account",
};
