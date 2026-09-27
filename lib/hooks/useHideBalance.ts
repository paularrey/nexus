"use client";

import { useSyncExternalStore } from "react";

const storageKey = "ravecard-hide-balance";
const changeEvent = "ravecard-hide-balance-change";

function subscribe(onStoreChange: () => void) {
  window.addEventListener(changeEvent, onStoreChange);
  window.addEventListener("storage", onStoreChange);
  return () => {
    window.removeEventListener(changeEvent, onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}

function getSnapshot() {
  return window.localStorage.getItem(storageKey) === "1";
}

function getServerSnapshot() {
  return false;
}

export function useHideBalance() {
  const hideBalance = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  const setHideBalance = (value: boolean) => {
    if (value) window.localStorage.setItem(storageKey, "1");
    else window.localStorage.removeItem(storageKey);
    window.dispatchEvent(new Event(changeEvent));
  };

  return { hideBalance, setHideBalance };
}
