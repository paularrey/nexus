"use client";

import { Drawer } from "vaul";
import {
  Bell,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  EyeOff,
  Fingerprint,
  Gauge,
  KeyRound,
  Languages,
  LogIn,
  Monitor,
  Moon,
  Palette,
  RotateCcw,
  ShieldCheck,
  Smartphone,
  Sun,
  Trash2,
  Users,
} from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useState, useSyncExternalStore } from "react";
import { toast } from "sonner";

import { PinModal } from "@/components/payments/PinModal";
import { ActionRow } from "@/components/ui/ActionRow";
import { Button } from "@/components/ui/Button";
import { CardSection } from "@/components/ui/CardSection";
import { PageHeader } from "@/components/ui/PageHeader";
import { SettingToggle } from "@/components/ui/SettingToggle";
import {
  languageOptions,
  translations,
  usePreferences,
  type Language,
} from "@/lib/context/preferences-context";
import { useHideBalance } from "@/lib/hooks/useHideBalance";
import { usePinFlow } from "@/lib/hooks/usePinFlow";
import type { LucideIcon } from "lucide-react";

// TODO: Connect to real user data
const phoneAccount = "+234 •••• 9014";
const beneficiaries = [
  { id: "b1", name: "Chidi Okafor", detail: "0803 ••• 1122" },
  { id: "b2", name: "Amara Musa", detail: "0810 ••• 4471" },
  { id: "b3", name: "Tunde Bakare", detail: "0705 ••• 8830" },
];

function SectionHeader({
  icon: Icon,
  eyebrow,
  title,
}: {
  icon: LucideIcon;
  eyebrow: string;
  title: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="grid size-10 place-items-center rounded-xl bg-secondary text-primary">
        <Icon className="size-5" />
      </span>
      <div>
        <p className="text-sm font-medium text-muted-foreground">{eyebrow}</p>
        <h2 className="mt-1 font-heading text-2xl font-semibold">{title}</h2>
      </div>
    </div>
  );
}

export default function ProfileSettingsPage() {
  const { language: savedLanguage, setLanguage } = usePreferences();
  const labels = translations[savedLanguage];
  const { resolvedTheme, setTheme, theme } = useTheme();
  const { hideBalance, setHideBalance } = useHideBalance();
  const { pinOpen, setPinOpen, openPin } = usePinFlow();
  const [pinAction, setPinAction] = useState<"passcode" | "reset">("passcode");
  const [biometricsEnabled, setBiometricsEnabled] = useState(false);
  const [beneficiariesOpen, setBeneficiariesOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
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

  const activeThemeIndex = mounted
    ? Math.max(
        0,
        themeOptions.findIndex((option) => option.value === theme),
      )
    : 0;

  const startPin = (action: "passcode" | "reset") => {
    setPinAction(action);
    openPin();
  };

  return (
    <div className="mx-auto w-full max-w-3xl space-y-8">
      <div>
        <Link
          href="/profile"
          className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ChevronLeft className="size-4" /> Profile
        </Link>
      </div>

      <PageHeader
        eyebrow="Settings"
        title={labels.settingsTitle}
        lede="Everything about Ravecard, in one place — under your profile."
      />

      {/* Security */}
      <CardSection>
        <SectionHeader
          icon={ShieldCheck}
          eyebrow="Account protection"
          title="Security"
        />
        <div className="mt-3">
          <ActionRow
            icon={KeyRound}
            label="Change passcode"
            description="Update the passcode you use to unlock Ravecard"
            onClick={() => startPin("passcode")}
          />
          <ActionRow
            icon={RotateCcw}
            label="Reset PIN"
            description="Set a new PIN for authorising transactions"
            onClick={() => startPin("reset")}
          />
          <ActionRow
            icon={LogIn}
            label="Login options"
            value="Email + password"
            onClick={() =>
              toast.info("Login options", {
                description: "Simulated in this preview.",
              })
            }
          />
          <SettingToggle
            label="Biometrics"
            description="Confirm sensitive actions with Face ID or fingerprint."
            icon={Fingerprint}
            enabled={biometricsEnabled}
            onChange={() => setBiometricsEnabled((value) => !value)}
          />
          <SettingToggle
            label="Hide balance"
            description="Mask your balance on the Home screen."
            icon={EyeOff}
            enabled={hideBalance}
            onChange={() => setHideBalance(!hideBalance)}
          />
        </div>
      </CardSection>

      {/* App & Device */}
      <CardSection>
        <SectionHeader
          icon={Smartphone}
          eyebrow="On this device"
          title="App & Device"
        />
        <div className="mt-3">
          <ActionRow
            icon={Monitor}
            label="Device Management"
            value="2 active"
            onClick={() =>
              toast.info("Device Management", {
                description: "Simulated in this preview.",
              })
            }
          />
          <ActionRow
            icon={Bell}
            label="Notification Preferences"
            onClick={() =>
              toast.info("Notification Preferences", {
                description: "Simulated in this preview.",
              })
            }
          />

          <div className="border-b border-border py-4 last:border-b-0">
            <div className="flex items-center gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-secondary text-primary">
                <Palette className="size-5" />
              </span>
              <div>
                <p className="font-medium">Themes</p>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  {mounted
                    ? `${resolvedTheme === "dark" ? "Dark" : "Light"} appearance is active.`
                    : "Loading appearance..."}
                </p>
              </div>
            </div>
            <div
              className="relative mt-4 grid grid-cols-3 rounded-xl border border-border bg-muted/50 p-1"
              role="radiogroup"
              aria-label="Theme preference"
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-1 left-1 w-[calc((100%-0.5rem)/3)] rounded-lg bg-card shadow-sm transition-transform duration-300 ease-out"
                style={{ transform: `translateX(${activeThemeIndex * 100}%)` }}
              />
              {themeOptions.map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  type="button"
                  role="radio"
                  aria-checked={mounted && theme === value}
                  onClick={() => {
                    setTheme(value);
                    toast.success(`${label} theme selected`);
                  }}
                  className="relative z-10 flex min-w-0 items-center justify-center gap-2 rounded-lg px-2 py-2 text-sm font-medium text-muted-foreground transition-colors aria-checked:text-foreground"
                >
                  <Icon className="size-4" />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </CardSection>

      {/* Transactions */}
      <CardSection>
        <SectionHeader
          icon={Gauge}
          eyebrow="Money moves"
          title="Transactions"
        />
        <div className="mt-3">
          <ActionRow
            icon={Smartphone}
            label="Phone Number Account"
            value={phoneAccount}
            chevron={false}
          />
          <ActionRow
            icon={Gauge}
            label="Transaction Limits"
            value="₦500,000 / day"
            chevron={false}
          />
          <ActionRow
            icon={Users}
            label="Beneficiaries"
            description="Saved recipients for transfers"
            value={`${beneficiaries.length} saved`}
            chevron={beneficiariesOpen}
            onClick={() => setBeneficiariesOpen((open) => !open)}
            trailing={
              <ChevronRight
                className={`size-4 shrink-0 text-muted-foreground transition-transform ${beneficiariesOpen ? "rotate-90" : ""}`}
              />
            }
          />
          {beneficiariesOpen && (
            <div className="border-b border-border py-3 last:border-b-0">
              <ul className="space-y-1">
                {beneficiaries.map((beneficiary) => (
                  <li
                    key={beneficiary.id}
                    className="flex items-center gap-3 rounded-xl px-2 py-2 transition-colors hover:bg-muted"
                  >
                    <span className="grid size-9 shrink-0 place-items-center rounded-full bg-secondary text-xs font-bold text-primary">
                      {beneficiary.name
                        .split(" ")
                        .map((part) => part[0])
                        .join("")}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium">
                        {beneficiary.name}
                      </span>
                      <span className="block text-xs text-muted-foreground">
                        {beneficiary.detail}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </CardSection>

      {/* Others */}
      <CardSection>
        <SectionHeader
          icon={Languages}
          eyebrow="Preferences"
          title="Others"
        />
        <div className="mt-3">
          <div className="flex items-center justify-between gap-3 border-b border-border py-4">
            <div className="flex min-w-0 items-center gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-secondary text-primary">
                <Languages className="size-5" />
              </span>
              <span className="text-sm font-medium">Language</span>
            </div>
            <span className="relative shrink-0">
              <select
                aria-label="Language"
                value={savedLanguage}
                onChange={(event) =>
                  setLanguage(event.target.value as Language)
                }
                className="h-10 appearance-none rounded-xl border border-input bg-background pl-3 pr-9 text-sm outline-none transition focus:border-primary focus:ring-3 focus:ring-primary/15"
              >
                {languageOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            </span>
          </div>
          <ActionRow
            icon={Trash2}
            label="Delete Account"
            description="Permanently remove your account and data"
            danger
            onClick={() => setDeleteOpen(true)}
          />
        </div>

        <div className="mt-6 flex justify-end">
          <Link
            href="/terms"
            className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
          >
            Terms & Conditions
          </Link>
        </div>
      </CardSection>

      {/* Reset PIN / change passcode confirmation */}
      <PinModal
        open={pinOpen}
        onOpenChange={setPinOpen}
        title={
          pinAction === "passcode"
            ? "Change your passcode"
            : "Reset your transaction PIN"
        }
        onSuccess={() =>
          toast.success(
            pinAction === "passcode"
              ? "Passcode updated"
              : "Transaction PIN reset",
            { description: "Demo only — no real credentials were changed." },
          )
        }
      />

      {/* Delete account confirmation */}
      <Drawer.Root open={deleteOpen} onOpenChange={setDeleteOpen}>
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 z-40 bg-scrim backdrop-blur-sm" />
          <Drawer.Content className="fixed inset-x-0 bottom-0 z-50 mx-auto h-fit max-h-[calc(100dvh-1rem)] w-full max-w-md overflow-hidden rounded-t-[28px] border border-border bg-card p-5 outline-none md:bottom-auto md:top-1/2 md:-translate-y-1/2 md:rounded-[30px] md:p-7">
            <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-muted md:hidden" />
            <Drawer.Title className="font-heading text-xl font-semibold">
              Delete your account?
            </Drawer.Title>
            <Drawer.Description className="mt-2 text-sm text-muted-foreground">
              This permanently removes your profile, wallet history, and
              settings. This can&apos;t be undone.
            </Drawer.Description>
            <div className="mt-5 flex gap-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => setDeleteOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="destructive"
                className="flex-1 gap-2"
                onClick={() => {
                  setDeleteOpen(false);
                  toast.success("Account deletion requested", {
                    description: "Demo only — nothing was actually removed.",
                  });
                }}
              >
                <Trash2 className="size-4" /> Delete
              </Button>
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    </div>
  );
}
