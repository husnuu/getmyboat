"use client";

import {
  HOUR_OPTIONS,
  UNIT_FIELD_CONFIG,
  isInternalFeatureStorageKey,
  isHourFieldKey,
  isUnitFieldKey,
  parseUnitFieldValues,
  unitSuffix,
  writeUnitFieldValues,
} from "@getyourboat/shared";
import { Field, Input, Select } from "../ui";

/** Short suffix shown inside the input (fixed metre / litre / knot). */
const UNIT_INPUT_SUFFIX: Record<string, string> = {
  length_ft_m: "m",
  beam_width: "m",
  draft: "m",
  water_tank_capacity: "L",
  waste_tank_capacity: "L",
  fuel_tank_capacity: "L",
  fuel_consumption: "L/saat",
  max_speed: "kn",
};

export function UnitFieldInput({
  fieldKey,
  label,
  values,
  onChange,
  error,
}: {
  fieldKey: string;
  label: string;
  values: Record<string, string>;
  onChange: (next: Record<string, string>) => void;
  error?: string;
}) {
  const cfg = UNIT_FIELD_CONFIG[fieldKey];
  const parsed = parseUnitFieldValues(fieldKey, values);
  const suffix = UNIT_INPUT_SUFFIX[fieldKey] ?? "";
  const unit =
    fieldKey === "length_ft_m"
      ? "M"
      : (cfg?.defaultUnit ?? parsed.unit);

  function updateRaw(raw: string) {
    const next = { ...values };
    writeUnitFieldValues(fieldKey, raw, unit, next);
    onChange(next);
  }

  if (!cfg) return null;

  return (
    <Field label={label} error={error}>
      <div className="relative">
        <Input
          type="number"
          min={0}
          step="any"
          className={suffix ? "pr-16" : undefined}
          value={parsed.raw}
          placeholder="0"
          error={!!error}
          onChange={(e) => updateRaw(e.target.value)}
        />
        {suffix ? (
          <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[13px] font-medium text-gray-400">
            {suffix}
          </span>
        ) : null}
      </div>
    </Field>
  );
}

export function HourFieldSelect({
  fieldKey,
  label,
  value,
  onChange,
  error,
}: {
  fieldKey: string;
  label: string;
  value: string;
  onChange: (key: string, value: string) => void;
  error?: string;
}) {
  return (
    <Field label={label} error={error}>
      <Select value={value} error={!!error} onChange={(e) => onChange(fieldKey, e.target.value)}>
        <option value="">Seçiniz…</option>
        {HOUR_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </Select>
    </Field>
  );
}

export function stripInternalFeatureKeys(values: Record<string, string>): Record<string, string> {
  const next: Record<string, string> = {};
  for (const [key, value] of Object.entries(values)) {
    if (isInternalFeatureStorageKey(key)) continue;
    next[key] = value;
  }
  return next;
}

export { isHourFieldKey, isUnitFieldKey, unitSuffix };
