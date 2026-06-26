"use client";

import {
  CABIN_TYPE_LABELS,
  CabinType,
  WC_TYPE_LABELS,
  WcType,
  type CabinConfigurationDTO,
  type CabinConfigurationInput,
} from "@getyourboat/shared";
import { Button, Modal, cn } from "@getyourboat/ui";
import { useState } from "react";
import { Field, Select } from "../ui";

const CABIN_TYPES = Object.values(CabinType);

export function CabinConfigurationSection({
  configurations,
  onChange,
}: {
  configurations: CabinConfigurationInput[];
  onChange: (next: CabinConfigurationInput[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const [draftType, setDraftType] = useState<CabinType | "">("");
  const [draftWc, setDraftWc] = useState<WcType | "">("");
  const [draftQty, setDraftQty] = useState(1);
  const hasCabins = configurations.length > 0;

  function resetDraft() {
    setDraftType("");
    setDraftWc("");
    setDraftQty(1);
  }

  function saveDraft() {
    if (!draftType) return;
    onChange([
      ...configurations,
      {
        cabinType: draftType,
        wcType: draftWc || null,
        quantity: draftQty,
      },
    ]);
    resetDraft();
    setOpen(false);
  }

  function removeAt(index: number) {
    onChange(configurations.filter((_, i) => i !== index));
  }

  return (
    <section className="space-y-4 border-t border-gray-100 pt-7">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-[15px] font-semibold text-ink">Kabin bilgisi</h3>
          <p className="mt-0.5 text-caption text-gray-500">
            Kabin tipi, WC detayı ve adet ekleyin.
          </p>
        </div>
        <Button type="button" size="sm" variant="outline" onClick={() => setOpen(true)}>
          Kabin & WC ekle
        </Button>
      </div>

      {configurations.length === 0 ? (
        <p className="text-body-sm text-gray-500">Henüz kabin konfigürasyonu eklenmedi.</p>
      ) : (
        <ul className="space-y-2">
          {configurations.map((c, index) => (
            <li
              key={`${c.cabinType}-${index}`}
              className="flex items-center justify-between gap-3 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3"
            >
              <div>
                <p className="text-body-sm font-medium text-ink">
                  {CABIN_TYPE_LABELS[c.cabinType]} × {c.quantity}
                </p>
                {c.wcType ? (
                  <p className="text-caption text-gray-500">{WC_TYPE_LABELS[c.wcType]}</p>
                ) : null}
              </div>
              <button
                type="button"
                className="text-caption text-danger-600 hover:underline"
                onClick={() => removeAt(index)}
              >
                Kaldır
              </button>
            </li>
          ))}
        </ul>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title="Kabin & WC ekle">
        <div className="space-y-5">
          <div>
            <p className="mb-3 text-body-sm font-medium text-ink">Kabin tipi</p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {CABIN_TYPES.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setDraftType(type)}
                  className={cn(
                    "rounded-xl border px-3 py-3 text-left text-caption font-medium transition",
                    draftType === type
                      ? "border-brand-500 bg-brand-50 text-brand-700"
                      : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                  )}
                >
                  {CABIN_TYPE_LABELS[type]}
                </button>
              ))}
            </div>
          </div>

          <Field label="WC & Shower">
            <Select
              value={draftWc}
              onChange={(e) => setDraftWc(e.target.value as WcType | "")}
            >
              <option value="">Seçiniz…</option>
              <option value={WcType.EXTERNAL}>{WC_TYPE_LABELS[WcType.EXTERNAL]}</option>
              <option
                value={WcType.EN_SUITE}
                disabled={!hasCabins && !draftType}
              >
                {WC_TYPE_LABELS[WcType.EN_SUITE]}
                {!hasCabins && !draftType ? " (önce kabin seçin)" : ""}
              </option>
            </Select>
          </Field>

          <Field label="Bu konfigürasyondan kaç adet?">
            <div className="flex items-center gap-3">
              <Button
                type="button"
                size="sm"
                variant="outline"
                disabled={draftQty <= 1}
                onClick={() => setDraftQty((q) => Math.max(1, q - 1))}
              >
                −
              </Button>
              <span className="min-w-[2rem] text-center text-body-sm font-semibold">
                {draftQty}
              </span>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => setDraftQty((q) => q + 1)}
              >
                +
              </Button>
            </div>
          </Field>

          <div className="flex justify-end gap-2 border-t border-gray-100 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              İptal
            </Button>
            <Button type="button" disabled={!draftType} onClick={saveDraft}>
              Kaydet
            </Button>
          </div>
        </div>
      </Modal>
    </section>
  );
}

export function toCabinInputs(
  rows: CabinConfigurationDTO[] | undefined
): CabinConfigurationInput[] {
  return (rows ?? []).map((c) => ({
    cabinType: c.cabinType,
    wcType: c.wcType,
    quantity: c.quantity,
  }));
}
