const ONBOARDING_KEY = "ravecard-onboarding-seen";

export function shouldShowOnboarding(): boolean {
  if (typeof window === "undefined") return false;
  return !window.localStorage.getItem(ONBOARDING_KEY);
}

export function markOnboardingSeen(): void {
  window.localStorage.setItem(ONBOARDING_KEY, "1");
}
