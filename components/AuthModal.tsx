"use client";

import { Drawer } from "vaul";
import { Eye, EyeOff, LockKeyhole, X } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/context/auth-context";

export function AuthModal() {
  const { authOpen, closeAuth, login } = useAuth();
  const [mode, setMode] = useState<"sign-in" | "create-account">("sign-in");
  const [authMethod, setAuthMethod] = useState<"email" | "phone">("email");
  const [showPassword, setShowPassword] = useState(false);
  const [otpStep, setOtpStep] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpDestination, setOtpDestination] = useState("");
  const [otpError, setOtpError] = useState(false);

  // Vaul provides the mobile sheet gesture while CSS centers it on desktop.
  return (
    <Drawer.Root open={authOpen} onOpenChange={(open) => !open && closeAuth()}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm" />
        <Drawer.Content className="fixed inset-x-0 bottom-0 z-50 mx-auto max-h-[100dvh] w-full overflow-hidden rounded-t-[28px] border border-border bg-card p-4 shadow-2xl outline-none md:bottom-auto md:top-1/2 md:max-w-lg md:-translate-y-1/2 md:rounded-[28px] md:p-8">
          <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-muted md:mb-5" />
          <div className="mb-4 flex items-start justify-between gap-4 md:mb-7">
            <div>
              <Drawer.Title className="font-heading text-xl font-semibold tracking-tight md:text-2xl">
                {otpStep
                  ? "Verify your sign-in"
                  : mode === "sign-in"
                    ? "Welcome back"
                    : "Create your account"}
              </Drawer.Title>
              <Drawer.Description className="mt-1 text-sm text-muted-foreground md:mt-2">
                {otpStep
                  ? `Enter the six-digit code for ${otpDestination}.`
                  : mode === "sign-in"
                    ? "Sign in to continue with Nexus."
                    : "Set up your Nexus profile to get started."}
              </Drawer.Description>
            </div>
            <Button
              variant="ghost"
              size="icon-sm"
              type="button"
              onClick={closeAuth}
              aria-label="Close authentication"
            >
              <X />
            </Button>
          </div>

          {!otpStep && (
            <div className="mb-4 grid grid-cols-2 rounded-xl bg-muted p-1 md:mb-6">
              <button
                type="button"
                onClick={() => setMode("sign-in")}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  mode === "sign-in"
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground"
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setMode("create-account")}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  mode === "create-account"
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground"
                }`}
              >
                Create Account
              </button>
            </div>
          )}

          {!otpStep && mode === "sign-in" && (
            <div className="mb-4 flex gap-5 border-b border-border md:mb-5">
              {(["email", "phone"] as const).map((method) => (
                <button
                  key={method}
                  type="button"
                  onClick={() => setAuthMethod(method)}
                  aria-pressed={authMethod === method}
                  className={`border-b-2 pb-2 text-sm font-medium capitalize transition-colors ${
                    authMethod === method
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {method}
                </button>
              ))}
            </div>
          )}

          {otpStep ? (
            <form
              className="space-y-4"
              onSubmit={(event) => {
                event.preventDefault();
                if (otp === "123456") {
                  login();
                  return;
                }
                setOtpError(true);
              }}
            >
              <label className="block space-y-2 text-sm font-medium">
                One-time code
                <input
                  name="otp"
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  placeholder="Enter 123456"
                  value={otp}
                  onChange={(event) => {
                    setOtp(event.target.value.replace(/\D/g, "").slice(0, 6));
                    setOtpError(false);
                  }}
                  className="h-12 w-full rounded-xl border border-input bg-background px-3 text-center text-xl tracking-[0.35em] outline-none transition focus:border-primary focus:ring-3 focus:ring-primary/15"
                  aria-invalid={otpError}
                  required
                />
              </label>
              <p className="rounded-xl bg-secondary px-3 py-2 text-center text-sm text-secondary-foreground">
                Demo code: <strong>123456</strong>
              </p>
              {otpError && (
                <p className="text-sm font-medium text-danger">
                  That code does not match the demo code.
                </p>
              )}
              <Button type="submit" size="lg" className="h-11 w-full md:h-12">
                Verify and Sign In
              </Button>
              <button
                type="button"
                onClick={() => {
                  setOtpStep(false);
                  setOtp("");
                  setOtpError(false);
                }}
                className="w-full text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                Back to sign in
              </button>
            </form>
          ) : (
            <form
              className="space-y-3 md:space-y-4"
              onSubmit={(event) => {
                event.preventDefault();
                if (mode === "sign-in") {
                  const formData = new FormData(event.currentTarget);
                  const identifier = formData.get(authMethod) as string;
                  setOtpDestination(
                    authMethod === "phone"
                      ? `your phone ending in ${identifier.slice(-4)}`
                      : identifier,
                  );
                  setOtpStep(true);
                  return;
                }
                login();
              }}
            >
              {mode === "create-account" && (
                <label className="block space-y-2 text-sm font-medium">
                  Full name
                  <input
                    name="name"
                    type="text"
                    autoComplete="name"
                    placeholder="Your full name"
                    className="h-10 w-full rounded-xl border border-input bg-background px-3 outline-none transition focus:border-primary focus:ring-3 focus:ring-primary/15 md:h-11"
                    required
                  />
                </label>
              )}

              {mode === "create-account" || authMethod === "email" ? (
                <label className="block space-y-2 text-sm font-medium">
                  Email address
                  <input
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    className="h-10 w-full rounded-xl border border-input bg-background px-3 outline-none transition focus:border-primary focus:ring-3 focus:ring-primary/15 md:h-11"
                    required
                  />
                </label>
              ) : (
                <label className="block space-y-2 text-sm font-medium">
                  Phone number
                  <span className="flex h-10 overflow-hidden rounded-xl border border-input bg-background focus-within:border-primary focus-within:ring-3 focus-within:ring-primary/15 md:h-11">
                    <select
                      name="country-code"
                      defaultValue="+234"
                      aria-label="Country code"
                      className="border-r border-input bg-transparent px-3 text-sm outline-none"
                    >
                      <option value="+234">+234</option>
                      <option value="+1">+1</option>
                      <option value="+44">+44</option>
                    </select>
                    <input
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      placeholder="801 234 5678"
                      className="min-w-0 flex-1 bg-transparent px-3 outline-none"
                      required
                    />
                  </span>
                </label>
              )}

              <label className="block space-y-2 text-sm font-medium">
                Password
                <span className="relative block">
                  <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete={
                      mode === "sign-in" ? "current-password" : "new-password"
                    }
                    placeholder="Enter your password"
                    className="h-10 w-full rounded-xl border border-input bg-background px-10 pr-11 outline-none transition focus:border-primary focus:ring-3 focus:ring-primary/15 md:h-11"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((visible) => !visible)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>
                </span>
              </label>

              {mode === "create-account" && (
                <label className="block space-y-2 text-sm font-medium">
                  Confirm password
                  <input
                    name="confirm-password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Re-enter your password"
                    className="h-10 w-full rounded-xl border border-input bg-background px-3 outline-none transition focus:border-primary focus:ring-3 focus:ring-primary/15 md:h-11"
                    required
                  />
                </label>
              )}

              {mode === "sign-in" && (
                <button
                  type="button"
                  className="text-sm font-medium text-primary hover:underline"
                >
                  Forgot password?
                </button>
              )}

              <Button
                type="submit"
                size="lg"
                className="h-11 w-full bg-primary text-base shadow-[0_12px_28px_rgba(21,94,239,0.24)] hover:bg-primary/90 md:h-12"
              >
                {mode === "sign-in" ? "Sign In" : "Create Account"}
              </Button>
            </form>
          )}
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
