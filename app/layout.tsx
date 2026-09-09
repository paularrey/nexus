import type { Metadata } from "next";
import { DM_Sans, DM_Serif_Display, Geist_Mono } from "next/font/google";
import { Providers } from "./providers";
import { AppShell } from "@/components/layout/AppShell";
import { AuthProvider } from "@/lib/context/auth-context";
import { PreferencesProvider } from "@/lib/context/preferences-context";
import { Toaster } from "sonner";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

const dmSerifDisplay = DM_Serif_Display({
  variable: "--font-dm-serif-display",
  subsets: ["latin"],
  weight: "400",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nexus",
  description: "A unified wallet for everyday payments.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${dmSerifDisplay.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <Providers>
          <AuthProvider>
            <PreferencesProvider>
              <AppShell>{children}</AppShell>
              <Toaster position="bottom-right" richColors />
            </PreferencesProvider>
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}
