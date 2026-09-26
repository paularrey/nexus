import type { ReactNode } from "react";

type EmptyStateProps = {
  title: string;
  description?: string;
  children?: ReactNode;
  className?: string;
};

export function EmptyState({
  title,
  description,
  children,
  className = "",
}: EmptyStateProps) {
  return (
    <div
      className={`rounded-[28px] border border-dashed border-border bg-card p-12 text-center ${className}`}
    >
      <p className="text-lg font-semibold text-muted-foreground">{title}</p>
      {description && (
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      )}
      {children}
    </div>
  );
}
