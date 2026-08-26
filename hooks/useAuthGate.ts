"use client";

import { useAuth } from "@/lib/context/auth-context";

export function useAuthGate() {
  const { isLoggedIn, openAuth } = useAuth();

  return (action: () => void) => {
    // Guests authenticate first; signed-in users can continue immediately.
    if (isLoggedIn) {
      action();
      return;
    }

    openAuth(action);
  };
}
