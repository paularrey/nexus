"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

export type AuthMode = "sign-in" | "create-account";

type AuthContextValue = {
  isLoggedIn: boolean;
  authOpen: boolean;
  authMode: AuthMode;
  openAuth: (afterLogin?: () => void, mode?: AuthMode) => void;
  closeAuth: () => void;
  login: () => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>("sign-in");
  // Keep a gated action here so it can continue after the mock sign-in finishes.
  const pendingAction = useRef<(() => void) | undefined>(undefined);

  const openAuth = useCallback((afterLogin?: () => void, mode: AuthMode = "sign-in") => {
    pendingAction.current = afterLogin;
    setAuthMode(mode);
    setAuthOpen(true);
  }, []);

  const closeAuth = useCallback(() => {
    setAuthOpen(false);
    pendingAction.current = undefined;
  }, []);

  const login = useCallback(() => {
    // TODO: Connect to backend auth here
    setIsLoggedIn(true);
    setAuthOpen(false);
    // Run the action that originally asked the guest to sign in, if there is one.
    const action = pendingAction.current;
    pendingAction.current = undefined;
    action?.();
  }, []);

  const logout = useCallback(() => {
    setIsLoggedIn(false);
  }, []);

  const value = useMemo(
    () => ({
      isLoggedIn,
      authOpen,
      authMode,
      openAuth,
      closeAuth,
      login,
      logout,
    }),
    [authMode, authOpen, closeAuth, isLoggedIn, login, logout, openAuth],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
