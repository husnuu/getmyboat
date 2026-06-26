import * as React from "react";
import { cn } from "../lib/cn";
import { FontAwesomeIcon, type IconDefinition } from "../icons";

export interface EmptyStateProps {
  icon?: IconDefinition;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

/** Generic empty state for lists/sections with no data. */
export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-card border border-dashed border-gray-300 bg-white px-6 py-12 text-center",
        className
      )}
    >
      {icon ? (
        <FontAwesomeIcon icon={icon} className="mb-3 text-[32px] text-gray-400" aria-hidden />
      ) : null}
      <h3 className="text-subheading text-ink">{title}</h3>
      {description ? (
        <p className="mt-1 max-w-sm text-body-sm text-gray-500">{description}</p>
      ) : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}
