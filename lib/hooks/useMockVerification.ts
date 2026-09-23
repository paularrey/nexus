"use client";

import { useState } from "react";
import { toast } from "sonner";

type MockVerificationMessage = {
  title: string;
  description: string;
};

export function useMockVerification() {
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  const verify = (ready: boolean, message: MockVerificationMessage) => {
    if (!ready) return;
    setIsVerifying(true);
    setIsVerified(false);
    window.setTimeout(() => {
      setIsVerifying(false);
      setIsVerified(true);
      toast.success(message.title, { description: message.description });
    }, 700);
  };

  const reset = () => setIsVerified(false);

  return { isVerifying, isVerified, verify, reset };
}
