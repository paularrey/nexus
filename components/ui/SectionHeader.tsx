import type { LucideIcon } from "lucide-react";

type SectionHeaderProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  className?: string;
};

export function SectionHeader({
  icon: Icon,
  title,
  description,
  className = "flex items-center gap-3",
}: SectionHeaderProps) {
  return (
    <div className={className}>
      <span className="grid size-10 place-items-center rounded-xl bg-secondary text-primary">
        <Icon className="size-5" />
      </span>
      <div>
        <h2 className="font-heading text-xl font-semibold">{title}</h2>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
