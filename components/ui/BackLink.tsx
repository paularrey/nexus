import type { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

type BackLinkProps = {
  href: string;
  children: ReactNode;
};

export function BackLink({ href, children }: BackLinkProps) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
    >
      <ArrowLeft className="size-4" /> {children}
    </Link>
  );
}
