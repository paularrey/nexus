export type WalletTransaction = {
  id: string;
  title: string;
  description: string;
  amount: string;
  date: string;
  status: "Completed" | "Pending";
  reference: string;
};

export const walletData = {
  accountName: "Nexus Wallet",
  accountNumber: "0123456789",
  bankName: "Nexus Partner Bank",
  balance: "₦248,650",
  transactions: [
    {
      id: "txn-1",
      title: "Wallet funding",
      description: "Added to wallet",
      amount: "+₦50,000",
      date: "Today, 10:42 AM",
      status: "Completed",
      reference: "NEX-240827-001",
    },
    {
      id: "txn-2",
      title: "Airtime purchase",
      description: "MTN mobile top-up",
      amount: "-₦5,000",
      date: "Yesterday, 4:18 PM",
      status: "Completed",
      reference: "NEX-240826-014",
    },
    {
      id: "txn-3",
      title: "Wallet transfer",
      description: "Incoming transfer",
      amount: "+₦25,000",
      date: "Aug 24, 9:07 AM",
      status: "Pending",
      reference: "NEX-240824-006",
    },
  ] satisfies WalletTransaction[],
};
