"use client";

import { ThemeProvider } from "next-themes";

import type { ChildrenProps } from "@/types";

export function Providers({ children }: ChildrenProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      {children}
    </ThemeProvider>
  );
}
