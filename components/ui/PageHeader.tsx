import type { ReactNode } from "react";

type PageHeaderProps = {
  eyebrow: string;
  title: ReactNode;
  lede: ReactNode;
  ledeClassName?: string;
  action?: ReactNode;
};

export function PageHeader({
  eyebrow,
  title,
  lede,
  ledeClassName = "mt-2 text-muted-foreground",
  action,
}: PageHeaderProps) {
  const heading = (
    <>
      <p className="text-sm font-medium text-primary">{eyebrow}</p>
      <h1 className="mt-1 font-heading text-3xl font-semibold tracking-tight md:text-4xl">
        {title}
      </h1>
      <p className={ledeClassName}>{lede}</p>
    </>
  );

  if (!action) {
    return <header>{heading}</header>;
  }

  return (
    <header className="flex items-end justify-between gap-4">
      <div>{heading}</div>
      {action}
    </header>
  );
}
