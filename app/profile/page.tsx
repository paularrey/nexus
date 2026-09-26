"use client";

import { Drawer } from "vaul";
import { motion } from "framer-motion";
import {
  Check,
  ChevronRight,
  Copy,
  Download,
  Fingerprint,
  KeyRound,
  LogOut,
  Mail,
  MessageSquare,
  RefreshCw,
  Smartphone,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/Button";
import { CardSection } from "@/components/ui/CardSection";
import { PageHeader } from "@/components/ui/PageHeader";
import { SettingToggle } from "@/components/ui/SettingToggle";
import { SuccessBanner } from "@/components/ui/SuccessBanner";
import { useAuth } from "@/lib/context/auth-context";
import {
  translations,
  usePreferences,
} from "@/lib/context/preferences-context";

const profileName = "Alex Morgan";
const profileEmail = "alex@example.com";
const kycProgress = 72;

const DEMO_OTP_CODE = "123456";
const DEMO_2FA_SECRET = "RAVECARD-DEMO-2FA-KEY";
const initialBackupCodes = ["RC-4821", "RC-7314", "RC-9052", "RC-1683"];
const regeneratedBackupCodes = ["RC-2940", "RC-6178", "RC-8432", "RC-5061"];

export default function ProfilePage() {
  const { isLoggedIn, openAuth, logout } = useAuth();
  const { language } = usePreferences();
  const labels: Record<string, string> = {
    ...translations[language],
    copyAll: translations[language].copyAll ?? "Copy all",
    download: translations[language].download ?? "Download",
    regenerate: translations[language].regenerate ?? "Regenerate",
  };
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [twoFactorMethods, setTwoFactorMethods] = useState<string[]>([]);
  const [twoFactorMethod, setTwoFactorMethod] = useState("authenticator");
  const [twoFactorCode, setTwoFactorCode] = useState("");
  const [isVerifyingTwoFactor, setIsVerifyingTwoFactor] = useState(false);
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [disableOpen, setDisableOpen] = useState(false);
  const [regenerateOpen, setRegenerateOpen] = useState(false);
  const [backupCodes, setBackupCodes] = useState(initialBackupCodes);
  const [biometricsEnabled, setBiometricsEnabled] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success("You have been signed out", {
      description: "Your demo session has ended.",
    });
  };

  const toggleTwoFactor = () => {
    if (twoFactorEnabled) setDisableOpen(true);
    else setTwoFactorEnabled(true);
  };

  const verifyTwoFactor = () => {
    setIsVerifyingTwoFactor(true);
    window.setTimeout(() => {
      setIsVerifyingTwoFactor(false);
      if (twoFactorCode === DEMO_OTP_CODE) {
        setTwoFactorEnabled(true);
        setTwoFactorMethods((methods) =>
          Array.from(new Set([...methods, twoFactorMethod])),
        );
        toast.success("Two-factor authentication enabled");
      } else {
        toast.error("That code is not valid", {
          description: `Use the demo code ${DEMO_OTP_CODE}.`,
        });
      }
    }, 700);
  };

  const copySecret = async () => {
    await navigator.clipboard.writeText(DEMO_2FA_SECRET);
    toast.success("Secret key copied");
  };

  const sendCode = () => {
    setIsSendingCode(true);
    window.setTimeout(() => {
      setIsSendingCode(false);
      toast.success("Verification code sent", {
        description:
          twoFactorMethod === "sms"
            ? "Sent to +234 •••• 9014."
            : "Sent to a•••@example.com.",
      });
    }, 700);
  };

  const copyBackupCodes = async () => {
    await navigator.clipboard.writeText(backupCodes.join("\n"));
    toast.success("Backup codes copied");
  };

  const downloadBackupCodes = () => {
    const link = document.createElement("a");
    link.href = URL.createObjectURL(
      new Blob([backupCodes.join("\n")], { type: "text/plain" }),
    );
    link.download = "ravecard-backup-codes.txt";
    link.click();
    URL.revokeObjectURL(link.href);
    toast.success("Backup codes downloaded");
  };

  return (
    <div className="mx-auto w-full max-w-5xl space-y-8">
      <PageHeader
        eyebrow={labels.profile}
        title={labels.profileTitle}
        lede="Your identity, your security, your rules. Built for how you actually live."
      />

      {!isLoggedIn ? (
        <CardSection className="p-6 md:p-8">
          <div className="flex items-center gap-4">
            <span className="grid size-14 place-items-center rounded-2xl bg-secondary text-primary">
              <UserRound className="size-7" />
            </span>
            <div>
              <h2 className="font-heading text-2xl font-semibold">
                Sign in to view your profile
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Your account details are ready after the demo sign-in.
              </p>
            </div>
          </div>
          <Button
            type="button"
            onClick={() => openAuth()}
            className="mt-6 h-11"
          >
            Sign In
          </Button>
        </CardSection>
      ) : (
        <>
          <section className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
            <CardSection className="bg-surface p-6 text-foreground shadow-[0_4px_24px_rgb(15_23_42_/_0.08)] md:p-8">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="grid size-16 place-items-center rounded-2xl bg-primary font-heading text-2xl font-bold text-primary-foreground">
                    AM
                  </div>
                  <div>
                    <p className="font-heading text-2xl font-semibold">
                      {profileName}
                    </p>
                    <p className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="size-4" />
                      {profileEmail}
                    </p>
                  </div>
                </div>
                <span className="rounded-full bg-success/10 px-3 py-1 text-xs font-semibold text-success">
                  Active
                </span>
              </div>
              <div className="mt-8 flex items-center justify-between border-t border-border pt-5 text-sm">
                <span className="text-muted-foreground">Member since</span>
                <span className="text-foreground">August 2026</span>
              </div>
            </CardSection>

            <CardSection className="p-6 md:p-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Verification
                  </p>
                  <h2 className="mt-1 font-heading text-xl font-semibold">
                    KYC progress
                  </h2>
                </div>
                <ShieldCheck className="size-6 text-success" />
              </div>
              <div className="mt-5 flex items-center gap-5">
                <div className="relative size-28 shrink-0">
                  <svg
                    className="size-full -rotate-90"
                    viewBox="0 0 100 100"
                    aria-label={`${kycProgress}% KYC verified`}
                    role="img"
                  >
                    <circle
                      cx="50"
                      cy="50"
                      r="42"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="9"
                      className="text-muted"
                    />
                    <motion.circle
                      cx="50"
                      cy="50"
                      r="42"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="9"
                      strokeLinecap="round"
                      className="text-success"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: kycProgress / 100 }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      pathLength={1}
                    />
                  </svg>
                  <span className="absolute inset-0 grid place-items-center font-heading text-xl font-semibold">
                    {kycProgress}%
                  </span>
                </div>
                <div>
                  <p className="font-semibold">Almost there</p>
                  <p className="mt-1 text-sm leading-5 text-muted-foreground">
                    Complete your identity details to unlock higher limits.
                  </p>
                </div>
              </div>
            </CardSection>
          </section>

          <CardSection id="security">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Account protection
                </p>
                <h2 className="mt-1 font-heading text-2xl font-semibold">
                  Security settings
                </h2>
              </div>
              <Fingerprint className="size-6 text-primary" />
            </div>
            <div className="mt-5">
              <SettingToggle
                label={labels.twoFactor}
                description="Add a second check when signing in."
                icon={ShieldCheck}
                enabled={twoFactorEnabled}
                onChange={toggleTwoFactor}
              />
              {twoFactorEnabled && (
                <div className="mt-4 rounded-2xl border border-primary/25 bg-secondary/40 p-4">
                  <div
                    className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-4"
                    role="listbox"
                    aria-label="Two-factor methods"
                  >
                    {[
                      {
                        id: "authenticator",
                        label: labels.authenticator,
                        description: "Use an app",
                        icon: KeyRound,
                        recommended: true,
                      },
                      {
                        id: "sms",
                        label: labels.smsCode,
                        description: "Use your phone",
                        icon: Smartphone,
                        recommended: false,
                      },
                      {
                        id: "email",
                        label: labels.emailCode,
                        description: "Use your inbox",
                        icon: Mail,
                        recommended: false,
                      },
                      {
                        id: "backup",
                        label: labels.backupCodes,
                        description: "Use a saved code",
                        icon: MessageSquare,
                        recommended: false,
                      },
                    ].map(
                      ({ id, label, description, icon: Icon, recommended }) => (
                        <button
                          key={id}
                          type="button"
                          role="option"
                          aria-selected={twoFactorMethod === id}
                          onClick={() => setTwoFactorMethod(id)}
                          className={`relative rounded-xl border p-3 text-left transition-colors ${twoFactorMethod === id ? "border-primary bg-card text-foreground shadow-sm" : "border-border text-muted-foreground hover:border-primary/40"}`}
                        >
                          <Icon className="size-4 text-primary" />
                          <span className="mt-2 block text-xs font-semibold">
                            {label}
                          </span>
                          <span className="mt-1 block text-[11px]">
                            {description}
                          </span>
                          {recommended && (
                            <span className="absolute right-2 top-2 text-[9px] font-semibold uppercase text-accent">
                              {labels.recommended}
                            </span>
                          )}
                        </button>
                      ),
                    )}
                  </div>
                  {twoFactorMethod === "backup" ? (
                    <div>
                      <p className="font-semibold">{labels.backupCodes}</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Save these codes somewhere secure for emergencies.
                      </p>
                      <div className="mt-3 grid grid-cols-2 gap-2 rounded-xl border border-border bg-background p-3 font-mono text-xs">
                        {backupCodes.map((code) => (
                          <span key={code}>{code}</span>
                        ))}
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          onClick={copyBackupCodes}
                        >
                          <Copy /> {labels.copyAll}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={downloadBackupCodes}
                        >
                          <Download /> {labels.download}
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setRegenerateOpen(true);
                          }}
                        >
                          <RefreshCw /> {labels.regenerate}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="font-semibold">
                        {twoFactorMethod === "authenticator"
                          ? labels.setupAuthenticator
                          : `Verify with ${twoFactorMethod === "sms" ? labels.smsCode : labels.emailCode}`}
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {twoFactorMethod === "authenticator"
                          ? "Scan the demo QR or use this secret key."
                          : twoFactorMethod === "sms"
                            ? "We will send a code to +234 •••• 9014."
                            : "We will send a code to a•••@example.com."}
                      </p>
                      {twoFactorMethod === "authenticator" && (
                        <div className="mt-3 flex items-center gap-3">
                          <div
                            className="grid size-20 grid-cols-5 gap-1 rounded-lg bg-card p-2"
                            aria-label="Demo QR code placeholder"
                          >
                            {Array.from({ length: 25 }, (_, index) => (
                              <span
                                key={index}
                                className={
                                  (index * 7 + 3) % 5 < 2
                                    ? "rounded-sm bg-foreground"
                                    : "rounded-sm bg-border"
                                }
                              />
                            ))}
                          </div>
                          <button
                            type="button"
                            onClick={copySecret}
                            className="flex min-w-0 items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-xs font-mono text-muted-foreground"
                          >
                            <span className="truncate">{DEMO_2FA_SECRET}</span>
                            <Copy className="size-3.5 shrink-0" />
                          </button>
                        </div>
                      )}
                      {twoFactorMethod !== "authenticator" && (
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          className="mt-3"
                          onClick={sendCode}
                          disabled={isSendingCode}
                        >
                          {isSendingCode ? labels.checking : labels.sendCode}
                        </Button>
                      )}
                      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                        <input
                          aria-label="Two-factor authentication code"
                          inputMode="numeric"
                          maxLength={6}
                          value={twoFactorCode}
                          onChange={(event) =>
                            setTwoFactorCode(
                              event.target.value.replace(/\D/g, ""),
                            )
                          }
                          placeholder={`Enter ${DEMO_OTP_CODE}`}
                          className="h-11 min-w-0 flex-1 rounded-xl border border-input bg-background px-3 text-center tracking-[0.3em] outline-none focus:border-primary focus:ring-3 focus:ring-primary/15"
                        />
                        <Button
                          type="button"
                          onClick={verifyTwoFactor}
                          disabled={
                            twoFactorCode.length !== 6 || isVerifyingTwoFactor
                          }
                          className="h-11 sm:min-w-28"
                        >
                          {isVerifyingTwoFactor
                            ? labels.checking
                            : labels.verify}
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              )}
              {twoFactorEnabled && twoFactorMethods.length > 0 && (
                <SuccessBanner
                  className="mt-4"
                  icon={Check}
                  title={labels.twoFactorEnabled}
                  description="Your account has an extra sign-in check."
                />
              )}
              <SettingToggle
                label="Biometric confirmation"
                description="Use device biometrics for sensitive actions."
                icon={Fingerprint}
                enabled={biometricsEnabled}
                onChange={() => setBiometricsEnabled((value) => !value)}
              />
            </div>
          </CardSection>

          <Drawer.Root open={disableOpen} onOpenChange={setDisableOpen}>
            <Drawer.Portal>
              <Drawer.Overlay className="fixed inset-0 z-40 bg-scrim backdrop-blur-sm" />
              <Drawer.Content className="fixed inset-x-0 bottom-0 z-50 mx-auto h-fit max-h-[calc(100dvh-1rem)] w-full max-w-md overflow-y-auto rounded-t-[28px] border border-border bg-card p-5 outline-none md:bottom-auto md:top-1/2 md:-translate-y-1/2 md:rounded-[28px]">
                <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-muted md:hidden" />
                <Drawer.Title className="font-heading text-xl font-semibold">
                  {labels.disableTwoFactor}
                </Drawer.Title>
                <Drawer.Description className="mt-2 text-sm text-muted-foreground">
                  Choose a verification method and enter the demo code to
                  confirm.
                </Drawer.Description>
                <select
                  value={twoFactorMethod}
                  onChange={(event) => setTwoFactorMethod(event.target.value)}
                  className="mt-5 h-11 w-full rounded-xl border border-input bg-background px-3"
                >
                  <option value="authenticator">{labels.authenticator}</option>
                  <option value="sms">{labels.smsCode}</option>
                  <option value="email">{labels.emailCode}</option>
                </select>
                <input
                  aria-label="Disable 2FA verification code"
                  inputMode="numeric"
                  maxLength={6}
                  value={twoFactorCode}
                  onChange={(event) =>
                    setTwoFactorCode(event.target.value.replace(/\D/g, ""))
                  }
                  placeholder={`Enter ${DEMO_OTP_CODE}`}
                  className="mt-3 h-11 w-full rounded-xl border border-input bg-background px-3 text-center tracking-[0.3em]"
                />
                <div className="mt-5 flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => setDisableOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    className="flex-1"
                    disabled={twoFactorCode !== DEMO_OTP_CODE}
                    onClick={() => {
                      setTwoFactorEnabled(false);
                      setTwoFactorMethods([]);
                      setTwoFactorCode("");
                      setDisableOpen(false);
                      toast.success("Two-factor authentication disabled");
                    }}
                  >
                    Disable
                  </Button>
                </div>
              </Drawer.Content>
            </Drawer.Portal>
          </Drawer.Root>

          <Drawer.Root open={regenerateOpen} onOpenChange={setRegenerateOpen}>
            <Drawer.Portal>
              <Drawer.Overlay className="fixed inset-0 z-40 bg-scrim backdrop-blur-sm" />
              <Drawer.Content className="fixed inset-x-0 bottom-0 z-50 mx-auto h-fit max-h-[calc(100dvh-1rem)] w-full max-w-md overflow-y-auto rounded-t-[28px] border border-border bg-card p-5 outline-none md:bottom-auto md:top-1/2 md:-translate-y-1/2 md:rounded-[28px]">
                <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-muted md:hidden" />
                <Drawer.Title className="font-heading text-xl font-semibold">
                  Regenerate backup codes?
                </Drawer.Title>
                <Drawer.Description className="mt-2 text-sm text-muted-foreground">
                  Your current demo codes will stop working.
                </Drawer.Description>
                <div className="mt-5 flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => setRegenerateOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    className="flex-1"
                    onClick={() => {
                      setBackupCodes(regeneratedBackupCodes);
                      setRegenerateOpen(false);
                      toast.success("Backup codes regenerated");
                    }}
                  >
                    Regenerate
                  </Button>
                </div>
              </Drawer.Content>
            </Drawer.Portal>
          </Drawer.Root>

          <section className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Link
              href="/settings"
              className="flex items-center justify-between rounded-2xl border border-border bg-card px-4 py-3 text-sm font-semibold transition-colors hover:border-primary/40 sm:w-auto sm:gap-8"
            >
              Profile preferences{" "}
              <ChevronRight className="size-4 text-muted-foreground" />
            </Link>
            <Button
              type="button"
              variant="destructive"
              onClick={handleLogout}
              className="h-11 gap-2 transition-shadow hover:shadow-[0_0_22px_rgb(79_70_229_/_0.35)]"
            >
              <LogOut className="size-4" /> Sign out
            </Button>
          </section>
        </>
      )}
    </div>
  );
}
