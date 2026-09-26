import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

type SuccessBannerProps = {
  icon: LucideIcon;
  title: string;
  description: ReactNode;
  className?: string;
};

export function SuccessBanner({
  icon: Icon,
  title,
  description,
  className,
}: SuccessBannerProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-2xl border border-success/30 bg-success/10 p-4 text-success",
        className,
      )}
    >
      <Icon className="size-5" />
      <div>
        <p className="font-semibold">{title}</p>
        <p className="text-sm text-success/80">{description}</p>
      </div>
    </div>
  );
}
