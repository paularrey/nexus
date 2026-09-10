"use client";

import { Cookie, Settings2, X } from "lucide-react";
import { useSyncExternalStore } from "react";

import { Button } from "@/components/ui/button";

const consentStorageKey = "ravecard-cookie-consent";

export function CookieConsent() {
  const visible = useSyncExternalStore(
    (onStoreChange) => {
      window.addEventListener("ravecard-cookie-consent-change", onStoreChange);
      return () =>
        window.removeEventListener(
          "ravecard-cookie-consent-change",
          onStoreChange,
        );
    },
    () => sessionStorage.getItem(consentStorageKey) === null,
    () => false,
  );

  const dismiss = (value: "accepted" | "managed") => {
    sessionStorage.setItem(consentStorageKey, value);
    window.dispatchEvent(new Event("ravecard-cookie-consent-change"));
  };

  if (!visible) return null;

  return (
    <aside className="fixed inset-x-3 bottom-24 z-40 mx-auto max-w-xl rounded-2xl border border-border bg-card p-4 shadow-2xl md:inset-x-auto md:bottom-5 md:right-5 md:mx-0">
      <div className="flex items-start gap-3">
        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-secondary text-primary">
          <Cookie className="size-5" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <h2 className="font-semibold">Cookies on Ravecard</h2>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={() => dismiss("managed")}
              aria-label="Dismiss cookie notice"
            >
              <X />
            </Button>
          </div>
          <p className="mt-1 text-sm leading-5 text-muted-foreground">
            We use essential browser storage to remember preferences and keep
            this preview consistent.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button type="button" size="sm" onClick={() => dismiss("accepted")}>
              Accept
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => dismiss("managed")}
            >
              <Settings2 /> Manage preferences
            </Button>
          </div>
        </div>
      </div>
    </aside>
  );
}
