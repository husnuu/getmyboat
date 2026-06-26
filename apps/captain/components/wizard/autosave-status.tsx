"use client";

import { Spinner, cn, FontAwesomeIcon, faCircleCheck, faTriangleExclamation } from "@getyourboat/ui";
import type { AutosaveStatus } from "../../lib/hooks/useAutosaveDraft";
import { formatLastSavedAt } from "../../lib/hooks/useAutosaveDraft";

export function AutosaveStatusIndicator({
  status,
  lastSavedAt,
  className,
}: {
  status: AutosaveStatus;
  lastSavedAt?: string | Date | null;
  className?: string;
}) {
  const savedLabel = formatLastSavedAt(lastSavedAt);

  if (status === "saving") {
    return (
      <p className={cn("flex items-center gap-2 text-caption text-gray-500", className)}>
        <Spinner className="h-3.5 w-3.5" />
        Kaydediliyor…
      </p>
    );
  }

  if (status === "error") {
    return (
      <p className={cn("flex items-center gap-2 text-caption text-danger-600", className)}>
        <FontAwesomeIcon icon={faTriangleExclamation} className="text-[12px]" aria-hidden />
        Kaydedilemedi, tekrar deneniyor…
      </p>
    );
  }

  if (status === "saved" || savedLabel) {
    return (
      <p className={cn("flex items-center gap-2 text-caption text-success-700", className)}>
        <FontAwesomeIcon icon={faCircleCheck} className="text-[12px]" aria-hidden />
        Tüm değişiklikler kaydedildi{savedLabel ? ` · ${savedLabel}` : ""}
      </p>
    );
  }

  return null;
}
