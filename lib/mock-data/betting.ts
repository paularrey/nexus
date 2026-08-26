export type BettingPlatform = {
  name: string;
  shortName: string;
  color: string;
};

export const bettingData = {
  platforms: [
    { name: "Bet9ja", shortName: "B9", color: "#f3b51b" },
    { name: "SportyBet", shortName: "S", color: "#e64b39" },
    { name: "1xBet", shortName: "1X", color: "#1976d2" },
    { name: "BetKing", shortName: "BK", color: "#1b9a59" },
  ] satisfies BettingPlatform[],
  amounts: [1000, 2000, 5000, 10000, 20000],
  mockAccountName: "Nexus demo account",
};
