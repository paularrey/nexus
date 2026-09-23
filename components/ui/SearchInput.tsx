"use client";

import { Search } from "lucide-react";

type SearchInputProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  id?: string;
  "aria-label"?: string;
};

export function SearchInput({
  value,
  onChange,
  placeholder,
  className = "relative",
  id,
  "aria-label": ariaLabel,
}: SearchInputProps) {
  return (
    <div className={className}>
      <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <input
        id={id}
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-label={ariaLabel}
        className="h-12 w-full rounded-2xl border border-border bg-card pl-11 pr-4 text-sm outline-none transition focus:border-primary focus:ring-3 focus:ring-primary/15"
      />
    </div>
  );
}
