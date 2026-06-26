"use client";

import type { ReactNode } from "react";
import type { FieldErrorsMap } from "@getyourboat/shared";
import { FormErrorBanner } from "@getyourboat/ui";
import { buildFieldLabelMap } from "../../lib/validation-errors";
import { Alert } from "../ui";

export function StepValidationAlert({
  fieldErrors,
  errorSummary,
  fieldLabels,
}: {
  fieldErrors: FieldErrorsMap;
  errorSummary: string | null;
  fieldLabels?: Record<string, string>;
}): ReactNode {
  if (Object.keys(fieldErrors).length > 0) {
    return (
      <FormErrorBanner
        fieldErrors={fieldErrors}
        fieldLabels={fieldLabels ?? buildFieldLabelMap(fieldErrors)}
      />
    );
  }
  if (errorSummary) return <Alert>{errorSummary}</Alert>;
  return null;
}
