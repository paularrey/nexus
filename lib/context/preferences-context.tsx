"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
} from "react";

import type { ChildrenProps, Language } from "@/types";

export type { Language };

export const languageOptions = [
  { label: "English", value: "en" },
  { label: "Igbo", value: "ig" },
] as const;

export const translations: Record<Language, Record<string, string>> = {
  en: {
    settings: "Settings",
    profile: "Profile",
    home: "Home",
    wallet: "Wallet",
    bills: "Bills",
    airtime: "Airtime & Data",
    signIn: "Sign In",
    savePreferences: "Save preferences",
    walletTitle: "Move money. Move freely.",
    billsTitle: "Bills handled. Life moving.",
    airtimeTitle: "Top up in seconds. Stay in motion.",
    bettingTitle: "Fund your play wallet.",
    giftTitle: "Buy or sell a gift card.",
    profileTitle: "Your Ravecard identity.",
    settingsTitle: "Make Ravecard yours.",
    availableBalance: "Available balance",
    quickAccess: "Quick access",
    recentTransactions: "Recent transactions",
    personalWallet: "Personal wallet",
    goodToSeeYou: "Ready when you are",
    homeTitle: "Your money, in motion.",
    homeDescription: "Move money. Move freely. Everything you need, one tap away.",
    viewWallet: "View wallet",
    pulseNote: "Ravecard Pulse",
    smallMoves: "Your card. Your rules. Your freedom.",
    checkActivity: "See recent activity",
    moreServices: "More ways to move freely — coming soon as Ravecard grows.",
    exploreMore: "Explore more",
    twoFactor: "Two-factor authentication",
    authenticator: "Authenticator app",
    smsCode: "SMS code",
    emailCode: "Email code",
    backupCodes: "Backup codes",
    recommended: "Recommended",
    verify: "Verify",
    sendCode: "Send code",
    checking: "Checking...",
    setupAuthenticator: "Set up your authenticator",
    twoFactorEnabled: "2FA enabled",
    disableTwoFactor: "Disable two-factor authentication?",
  },
  ig: {
    settings: "Ntọala",
    profile: "Profaịlụ",
    home: "Ụlọ",
    wallet: "Akpa ego",
    bills: "Ụgwọ",
    airtime: "Airtime na data",
    signIn: "Banye",
    savePreferences: "Chekwaa ntọala",
    walletTitle: "Wugharịa ego gị n'ohuru.",
    billsTitle: "Ụgwọ dịcha. Ndụ na-aga n'ihu.",
    airtimeTitle: "Tupu na nkeji ole na ole. Nọgide n'ihu.",
    bettingTitle: "Tinye ego na akpa egwuregwu gi.",
    giftTitle: "Zụta ma obu ree kaadi onyinye.",
    profileTitle: "Onye gi na Ravecard.",
    settingsTitle: "Mee Ravecard nke gi.",
    availableBalance: "Ego di",
    quickAccess: "Nnweta ngwa ngwa",
    recentTransactions: "Azumahia nso nso",
    personalWallet: "Akpa ego nke onwe",
    goodToSeeYou: "Anyị dị njikere mgbe ị dị njikere",
    homeTitle: "Ego gi na-aga n'ihu.",
    homeDescription: "Coordinator ego gi n'ohuru. Ihe niile ị chọrọ, n'otu pịa.",
    viewWallet: "Lee akpa ego",
    pulseNote: "Ihe Ravecard kwuru",
    smallMoves: "Kaadi gi. Iwu gi. Nne gi.",
    checkActivity: "Lelee azụmahịa nso nso",
    moreServices: "Ọzọ ụzọ ije ego n'ohuru — ga-apụta na Ravecard.",
    exploreMore: "Chọgharịa ọzọ",
    twoFactor: "Nyocha uzo abuo",
    authenticator: "Ngwa nyochaa",
    smsCode: "Koodu SMS",
    emailCode: "Koodu ozi-e",
    backupCodes: "Koodu ndabere",
    recommended: "Akwadoro",
    verify: "Nyochaa",
    sendCode: "Ziga koodu",
    checking: "Na-enyocha...",
    setupAuthenticator: "Tọọ ngwa nyochaa gi",
    twoFactorEnabled: "2FA na-arụ ọrụ",
    disableTwoFactor: "Gbanyụọ nyocha uzo abuo?",
  },
};

type PreferencesContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
};

const PreferencesContext = createContext<PreferencesContextValue | null>(null);

export function PreferencesProvider({ children }: ChildrenProps) {
  const language = useSyncExternalStore<Language>(
    (onStoreChange) => {
      window.addEventListener("ravecard-language-change", onStoreChange);
      return () =>
        window.removeEventListener("ravecard-language-change", onStoreChange);
    },
    () => {
      const savedLanguage = window.localStorage.getItem("ravecard-language");
      return languageOptions.some((option) => option.value === savedLanguage)
        ? (savedLanguage as Language)
        : "en";
    },
    () => "en",
  );

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = useCallback((nextLanguage: Language) => {
    window.localStorage.setItem("ravecard-language", nextLanguage);
    window.dispatchEvent(new Event("ravecard-language-change"));
  }, []);

  const value = useMemo(
    () => ({ language, setLanguage }),
    [language, setLanguage],
  );

  return (
    <PreferencesContext.Provider value={value}>
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences() {
  const context = useContext(PreferencesContext);
  if (!context) {
    throw new Error("usePreferences must be used inside PreferencesProvider");
  }
  return context;
}
