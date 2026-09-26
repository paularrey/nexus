"use client";

import { useState } from "react";

import { useAuthGate } from "@/lib/hooks/useAuthGate";

export function usePinFlow() {
  const [pinOpen, setPinOpen] = useState(false);
  const authGate = useAuthGate();

  const openPin = () => {
    authGate(() => {
      setPinOpen(true);
    });
  };

  return { pinOpen, setPinOpen, openPin };
}
