"use client";

import type { ReactNode } from "react";
import { Field, Label, Textarea } from "../ui";

/** Textarea where each non-empty line becomes a list item. */
export function LinesField({
  label,
  hint,
  value,
  onChange,
  rows = 4,
  required,
}: {
  label: string;
  hint?: string;
  value: string[];
  onChange: (value: string[]) => void;
  rows?: number;
  required?: boolean;
}) {
  const text = value.join("\n");
  return (
    <Field>
      <Label>
        {label}
        {required ? " *" : ""}
      </Label>
      {hint ? <p className="mb-1 text-xs text-gray-500">{hint}</p> : null}
      <Textarea
        rows={rows}
        value={text}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
          const lines = e.target.value
            .split("\n")
            .map((l: string) => l.trim())
            .filter(Boolean);
          onChange(lines);
        }}
        placeholder="Her satıra bir madde yazın"
      />
    </Field>
  );
}

export function StepShell({
  title,
  description,
  children,
  error,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  error?: string | null;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
        {description ? <p className="mt-1 text-sm text-gray-600">{description}</p> : null}
      </div>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <div className="space-y-4">{children}</div>
    </div>
  );
}
