"use client";

import { Drawer } from "vaul";
import {
  BadgeCheck,
  Bell,
  Camera,
  ChevronRight,
  CircleHelp,
  Gift,
  LogOut,
  Mail,
  Pencil,
  Phone,
  Settings,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { ActionRow } from "@/components/ui/ActionRow";
import { Button } from "@/components/ui/Button";
import { CardSection } from "@/components/ui/CardSection";
import { PageHeader } from "@/components/ui/PageHeader";
import { useAuth } from "@/lib/context/auth-context";
import { translations, usePreferences } from "@/lib/context/preferences-context";

// TODO: Connect to real user data
const profileName = "Alex Morgan";
const profileInitials = "AM";
const profileEmail = "alex@example.com";
const profilePhone = "+234 803 ••• 9014";
const referralCode = "RAVE-ALEX-24";

export default function ProfilePage() {
  const { isLoggedIn, openAuth, logout } = useAuth();
  const { language } = usePreferences();
  const labels = translations[language];
  const [logoutOpen, setLogoutOpen] = useState(false);

  const handleLogout = () => {
    setLogoutOpen(false);
    logout();
    toast.success("You have been signed out", {
      description: "Your demo session has ended.",
    });
  };

  const copyReferral = async () => {
    await navigator.clipboard.writeText(referralCode);
    toast.success("Referral code copied", {
      description: "Share it with friends — you both earn rewards.",
    });
  };

  return (
    <div className="mx-auto w-full max-w-3xl space-y-8">
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
          {/* Profile header */}
          <CardSection className="p-6 md:p-8">
            <div className="flex items-center gap-4">
              <span className="relative shrink-0">
                <span className="grid size-16 place-items-center rounded-full bg-primary font-heading text-xl font-bold text-primary-foreground">
                  {profileInitials}
                </span>
                <button
                  type="button"
                  aria-label="Change profile photo"
                  onClick={() =>
                    toast.info("Profile photo", {
                      description: "Photo updates are coming soon.",
                    })
                  }
                  className="absolute -bottom-1 -right-1 grid size-7 place-items-center rounded-full border border-border bg-card text-primary shadow-sm transition-colors hover:text-primary-hover focus-visible:outline-2 focus-visible:outline-ring"
                >
                  <Camera className="size-3.5" />
                </button>
              </span>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2.5">
                  <p className="font-heading text-2xl font-semibold">
                    {profileName}
                  </p>
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-2.5 py-1 text-secondary-foreground">
                      <ShieldCheck className="size-3.5" />
                      Basic
                    </span>
                    <span className="text-muted-foreground" aria-hidden="true">
                      →
                    </span>
                    <span className="rounded-full border border-border px-2.5 py-1 text-muted-foreground">
                      Verified
                    </span>
                  </span>
                </div>
                <p className="mt-1 truncate text-sm text-muted-foreground">
                  {profileEmail}
                </p>
              </div>

              <a
                href="#personal-info"
                className="hidden shrink-0 items-center gap-1 text-sm font-semibold text-primary hover:underline sm:inline-flex"
              >
                View details <ChevronRight className="size-4" />
              </a>
            </div>
          </CardSection>

          {/* Personal information */}
          <CardSection id="personal-info">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Your details
                </p>
                <h2 className="mt-1 font-heading text-2xl font-semibold">
                  Personal information
                </h2>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label="Edit personal information"
                onClick={() =>
                  toast.info("Edit personal information", {
                    description: "Editing is simulated in this preview.",
                  })
                }
              >
                <Pencil />
              </Button>
            </div>
            <div className="mt-2">
              <ActionRow
                icon={Phone}
                label="Phone number"
                value={profilePhone}
                chevron={false}
              />
              <ActionRow
                icon={Mail}
                label="Email address"
                value={profileEmail}
                chevron={false}
                trailing={
                  <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-success/10 px-2.5 py-1 text-xs font-semibold text-success">
                    <BadgeCheck className="size-3.5" />
                    Verified
                  </span>
                }
              />
            </div>
          </CardSection>

          {/* Actions */}
          <CardSection>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Quick actions
              </p>
              <h2 className="mt-1 font-heading text-2xl font-semibold">
                Actions
              </h2>
            </div>
            <div className="mt-2">
              <ActionRow
                icon={Gift}
                label="Refer & Earn"
                description="Share your code, both of you earn"
                onClick={copyReferral}
              />
              <ActionRow icon={Bell} label="Notifications" href="/notifications" />
              <ActionRow
                icon={CircleHelp}
                label="Help & Support"
                href="mailto:help@ravecard.app"
              />
              <ActionRow
                icon={Settings}
                label="Settings"
                description="Theme, security & preferences"
                href="/profile/settings"
              />
              <ActionRow
                icon={LogOut}
                label="Log out"
                danger
                onClick={() => setLogoutOpen(true)}
              />
            </div>
          </CardSection>

          {/* Log out confirmation */}
          <Drawer.Root open={logoutOpen} onOpenChange={setLogoutOpen}>
            <Drawer.Portal>
              <Drawer.Overlay className="fixed inset-0 z-40 bg-scrim backdrop-blur-sm" />
              <Drawer.Content className="fixed inset-x-0 bottom-0 z-50 mx-auto h-fit max-h-[calc(100dvh-1rem)] w-full max-w-md overflow-hidden rounded-t-[28px] border border-border bg-card p-5 outline-none md:bottom-auto md:top-1/2 md:-translate-y-1/2 md:rounded-[30px] md:p-7">
                <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-muted md:hidden" />
                <Drawer.Title className="font-heading text-xl font-semibold">
                  Log out of Ravecard?
                </Drawer.Title>
                <Drawer.Description className="mt-2 text-sm text-muted-foreground">
                  You&apos;ll need to sign in again to access your wallet.
                </Drawer.Description>
                <div className="mt-5 flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => setLogoutOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    className="flex-1 gap-2"
                    onClick={handleLogout}
                  >
                    <LogOut className="size-4" /> Log out
                  </Button>
                </div>
              </Drawer.Content>
            </Drawer.Portal>
          </Drawer.Root>
        </>
      )}
    </div>
  );
}
