"use client";

import { motion } from "framer-motion";
import { Check, ChevronDown, Monitor, Moon, Palette, Sun } from "lucide-react";
import { useState, useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  languageOptions,
  translations,
  usePreferences,
  type Language,
} from "@/lib/context/preferences-context";

const preferenceOptions = {
  currency: ["NGN - Nigerian Naira", "USD - US Dollar", "GBP - Pound Sterling"],
};

export default function SettingsPage() {
  const { language: savedLanguage, setLanguage } = usePreferences();
  const labels = translations[savedLanguage];
  const { resolvedTheme, setTheme, theme } = useTheme();
  const [currency, setCurrency] = useState(preferenceOptions.currency[0]);
  const mounted = useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false,
  );
  const themeOptions = [
    { value: "light", label: "Light", icon: Sun },
    { value: "dark", label: "Dark", icon: Moon },
    { value: "system", label: "System", icon: Monitor },
  ] as const;

  return (
    <div className="mx-auto w-full max-w-3xl space-y-8">
      <header>
        <p className="text-sm font-medium text-primary">Settings</p>
        <h1 className="mt-1 font-heading text-3xl font-semibold tracking-tight md:text-4xl">
          {labels.settingsTitle}
        </h1>
        <p className="mt-2 text-muted-foreground">
          Choose how the wallet looks and reads for you.
        </p>
      </header>

      <section className="rounded-[28px] border border-border bg-card p-5 md:p-8">
        <div className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-xl bg-secondary text-primary">
            <Palette className="size-5" />
          </span>
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Appearance
            </p>
            <h2 className="mt-1 font-heading text-2xl font-semibold">Theme</h2>
          </div>
        </div>
        <div
          className="relative mt-6 grid grid-cols-3 rounded-xl border border-border bg-muted/50 p-1"
          role="radiogroup"
          aria-label="Theme preference"
        >
          {mounted && (
            <motion.span
              layoutId="theme-highlight"
              transition={{ type: "spring", stiffness: 420, damping: 30 }}
              className="absolute inset-y-1 w-[calc(33.333%-0.333rem)] rounded-lg bg-card shadow-sm"
              style={{
                left: `calc(${themeOptions.findIndex((option) => option.value === theme) * 33.333}% + 0.25rem)`,
              }}
            />
          )}
          {themeOptions.map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              type="button"
              role="radio"
              aria-checked={mounted && theme === value}
              disabled={!mounted}
              onClick={() => {
                setTheme(value);
                toast.success(`${label} theme selected`);
              }}
              className="relative z-10 flex min-w-0 items-center justify-center gap-2 rounded-lg px-2 py-2 text-sm font-medium text-muted-foreground transition-colors aria-checked:text-foreground disabled:opacity-50"
            >
              <Icon className="size-4" />
              <span>{label}</span>
            </button>
          ))}
        </div>
        <p className="mt-3 text-sm text-muted-foreground">
          {mounted
            ? `${resolvedTheme === "dark" ? "Dark" : "Light"} appearance is active.`
            : "Loading appearance..."}
        </p>
      </section>

      <section className="rounded-[28px] border border-border bg-card p-5 md:p-8">
        <div className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-xl bg-orange-50 text-accent">
            <Check className="size-5" />
          </span>
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Display preferences
            </p>
            <h2 className="mt-1 font-heading text-2xl font-semibold">
              Language & currency
            </h2>
          </div>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-medium">
            Language
            <span className="relative mt-2 block">
              <select
                value={savedLanguage}
                onChange={(event) =>
                  setLanguage(event.target.value as Language)
                }
                className="h-12 w-full appearance-none rounded-xl border border-input bg-background px-3 pr-10 outline-none transition focus:border-primary focus:ring-3 focus:ring-primary/15"
              >
                {languageOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            </span>
          </label>
          <label className="text-sm font-medium">
            Currency
            <span className="relative mt-2 block">
              <select
                value={currency}
                onChange={(event) => setCurrency(event.target.value)}
                className="h-12 w-full appearance-none rounded-xl border border-input bg-background px-3 pr-10 outline-none transition focus:border-primary focus:ring-3 focus:ring-primary/15"
              >
                {preferenceOptions.currency.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            </span>
          </label>
        </div>
        <Button
          type="button"
          variant="secondary"
          className="mt-6"
          onClick={() =>
            toast.success("Preferences saved", {
              description: "Display preferences are simulated in this preview.",
            })
          }
        >
          {labels.savePreferences}
        </Button>
      </section>

      <div className="flex justify-end">
        <Link
          href="/terms"
          className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
        >
          Terms & Conditions
        </Link>
      </div>
    </div>
  );
}
