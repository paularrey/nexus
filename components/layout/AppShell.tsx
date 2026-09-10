"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Bell, Menu, Settings, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { AuthModal } from "@/components/AuthModal";
import { CookieConsent } from "@/components/CookieConsent";
import {
  OnboardingModal,
  shouldShowOnboarding,
  markOnboardingSeen,
} from "@/components/OnboardingModal";
import { useAuth } from "@/lib/context/auth-context";
import {
  translations,
  usePreferences,
} from "@/lib/context/preferences-context";
import { cn } from "@/lib/utils";
import { navItems } from "./nav-items";
import { SplashScreen } from "./SplashScreen";

type AppShellProps = {
  children: React.ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const { isLoggedIn, openAuth } = useAuth();
  const { language } = usePreferences();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [splashVisible, setSplashVisible] = useState(true);
  const [onboardingOpen, setOnboardingOpen] = useState(false);

  const labels = translations[language];
  const navLabels: Record<string, string> = {
    "/": labels.home,
    "/bills": labels.bills,
    "/airtime": labels.airtime,
    "/profile": labels.profile,
    "/subscriptions": "Subscriptions",
    "/bookings": "Bookings",
    "/history": "History",
  };

  useEffect(() => {
    // Register service worker for PWA
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // SW registration failed — app still works, just no offline support
      });
    }

    const splashTimer = window.setTimeout(() => {
      setSplashVisible(false);
      if (shouldShowOnboarding()) {
        window.setTimeout(() => setOnboardingOpen(true), 400);
      }
    }, 1400);

    return () => window.clearTimeout(splashTimer);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SplashScreen isVisible={splashVisible} />

      <header className="flex h-16 items-center justify-between border-b border-border bg-card px-4 md:hidden">
        <Link
          href="/"
          className="font-heading text-xl font-bold tracking-tight text-primary"
        >
          Ravecard
        </Link>
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="icon-sm" className="relative">
            <Link
              href="/notifications"
              aria-label="Open notifications"
              title="Notifications"
            >
              <Bell />
              <span className="absolute right-1 top-1 grid size-3.5 place-items-center rounded-full bg-accent text-[9px] font-bold text-white">
                2
              </span>
            </Link>
          </Button>
          <Button asChild variant="ghost" size="icon-sm">
            <Link
              href="/settings"
              aria-label={labels.settings}
              title={labels.settings}
            >
              <Settings />
            </Link>
          </Button>
          {!isLoggedIn && (
            <Button
              variant="outline"
              size="sm"
              type="button"
              onClick={() => openAuth()}
            >
              {labels.signIn}
            </Button>
          )}
        </div>
      </header>

      <motion.aside
        initial={false}
        animate={{ width: sidebarOpen ? 240 : 76 }}
        transition={{ type: "spring", stiffness: 320, damping: 28 }}
        className="fixed inset-y-0 left-0 z-20 hidden flex-col border-r border-sidebar-border bg-sidebar md:flex"
      >
        <div className="flex h-20 items-center justify-between border-b border-sidebar-border px-4">
          <AnimatePresence initial={false} mode="wait">
            {sidebarOpen ? (
              <motion.div
                key="full-logo"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                className="overflow-hidden whitespace-nowrap font-heading text-xl font-bold tracking-tight text-sidebar-primary"
              >
                Ravecard
              </motion.div>
            ) : (
              <motion.div
                key="compact-logo"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="font-heading text-xl font-bold text-sidebar-primary"
              >
                <Image src="/ravelogo192.png" alt="Ravecard" width={32} height={32} />
              </motion.div>
            )}
          </AnimatePresence>
          <Button
            variant="ghost"
            size="icon-sm"
            type="button"
            onClick={() => setSidebarOpen((open) => !open)}
            aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            {sidebarOpen ? <X /> : <Menu />}
          </Button>
        </div>

        <nav
          className="flex flex-1 flex-col gap-2 p-3"
          aria-label="Primary navigation"
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium text-sidebar-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  isActive &&
                    "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary hover:text-sidebar-primary-foreground",
                  !sidebarOpen && "justify-center px-0",
                )}
                aria-current={isActive ? "page" : undefined}
                title={!sidebarOpen ? item.label : undefined}
              >
                <Icon />
                {sidebarOpen && (
                  <span>{navLabels[item.href] ?? item.label}</span>
                )}
              </Link>
            );
          })}
        </nav>
      </motion.aside>

      <div
        className={cn(
          "min-h-screen transition-[padding] duration-200 md:pl-[240px]",
          !sidebarOpen && "md:pl-[76px]",
        )}
      >
        <div className="hidden h-20 items-center justify-between border-b border-border bg-card px-8 md:flex">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
              {labels.personalWallet}
            </p>
            <h1 className="font-heading text-lg font-semibold">
              {labels.goodToSeeYou}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <Button asChild variant="ghost" size="icon" className="relative">
              <Link
                href="/notifications"
                aria-label="Open notifications"
                title="Notifications"
              >
                <Bell />
                <span className="absolute right-1.5 top-1.5 grid size-4 place-items-center rounded-full bg-accent text-[9px] font-bold text-white">
                  2
                </span>
              </Link>
            </Button>
            <Button
              asChild
              variant="ghost"
              size="icon"
              aria-label="Open settings"
            >
              <Link href="/settings" title={labels.settings}>
                <Settings />
              </Link>
            </Button>
            {!isLoggedIn && (
              <Button
                variant="outline"
                type="button"
                onClick={() => openAuth()}
              >
                {labels.signIn}
              </Button>
            )}
          </div>
        </div>

        <motion.main
          key={pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="min-h-[calc(100vh-4rem)] px-4 pb-24 pt-6 md:min-h-[calc(100vh-5rem)] md:px-8 md:pb-8"
        >
          {children}
        </motion.main>
      </div>

      <nav
        className="fixed inset-x-0 bottom-0 z-30 grid h-20 grid-cols-6 border-t border-border bg-card/95 px-1 pb-2 pt-1 backdrop-blur md:hidden"
        aria-label="Mobile navigation"
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className="relative flex flex-col items-center justify-center gap-1 text-[10px] font-medium text-muted-foreground"
              aria-current={isActive ? "page" : undefined}
            >
              {isActive && (
                <motion.span
                  layoutId="active-nav-pill"
                  className="absolute top-1 h-1 w-8 rounded-full bg-primary shadow-[0_0_14px_var(--primary)]"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <Icon className={cn("size-5", isActive && "text-primary")} />
              <span className={cn(isActive && "text-primary")}>
                {navLabels[item.href] ?? item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      <AuthModal />
      <CookieConsent />
      <OnboardingModal
        open={onboardingOpen}
        onOpenChange={(open) => {
          setOnboardingOpen(open);
          if (!open) markOnboardingSeen();
        }}
      />
    </div>
  );
}
