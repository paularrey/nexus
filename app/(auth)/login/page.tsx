"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/context/auth-context";

function LoginContent() {
  const { openAuth } = useAuth();

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <section className="w-full max-w-md rounded-[28px] border border-border bg-card p-6 shadow-xl md:p-8">
        <Link
          href="/"
          className="font-heading text-xl font-bold tracking-tight text-primary"
        >
          Ravecard
        </Link>
        <h1 className="mt-10 font-heading text-3xl font-semibold tracking-tight">
          Sign in to continue
        </h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          Browse freely as a guest, or sign in when you are ready to complete an
          action.
        </p>
        <Button
          type="button"
          size="lg"
          className="mt-8 h-12 w-full"
          onClick={() => openAuth()}
        >
          Open Sign In
        </Button>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          <Link href="/" className="font-medium text-primary hover:underline">
            Return to home
          </Link>
        </p>
      </section>
    </main>
  );
}

export default function LoginPage() {
  return <LoginContent />;
}
