"use client";

import {
  GULET_BRAND_NAME,
  NOT_IN_LIST,
  type BoatBrandDTO,
  type BoatModelDTO,
  type FieldErrorsMap,
} from "@getyourboat/shared";
import { useEffect, useState } from "react";
import {
  getBrandsForBoatType,
  getModelsForBrand,
  prefetchBrandCatalog,
} from "../../lib/brand-catalog";
import { Field, Input, Select } from "../ui";

export interface BrandModelPendingRequest {
  requestedBrand: string;
  requestedModel?: string | null;
}

const BRAND_KEYS = new Set(["manufacturer_brand", "model"]);

export function isBrandModelFieldKey(key: string): boolean {
  return BRAND_KEYS.has(key);
}

export function BrandModelFields({
  boatTypeKey,
  values,
  onChange,
  onPendingRequestChange,
  isGulet,
  fieldErrors,
}: {
  boatTypeKey: string;
  values: Record<string, string>;
  onChange: (key: string, value: string) => void;
  onPendingRequestChange?: (request: BrandModelPendingRequest | null) => void;
  isGulet: boolean;
  fieldErrors?: FieldErrorsMap;
}) {
  const [brands, setBrands] = useState<BoatBrandDTO[]>([]);
  const [models, setModels] = useState<BoatModelDTO[]>([]);
  const [catalogReady, setCatalogReady] = useState(false);
  const [loadingModels, setLoadingModels] = useState(false);
  const [brandMode, setBrandMode] = useState<"catalog" | "custom">("catalog");
  const [modelMode, setModelMode] = useState<"catalog" | "custom">("catalog");
  const [selectedBrandId, setSelectedBrandId] = useState("");

  useEffect(() => {
    prefetchBrandCatalog().then(() => setCatalogReady(true));
  }, []);

  useEffect(() => {
    if (!boatTypeKey || isGulet) {
      setBrands([]);
      return;
    }
    let cancelled = false;
    getBrandsForBoatType(boatTypeKey).then((items) => {
      if (!cancelled) setBrands(items);
    });
    return () => {
      cancelled = true;
    };
  }, [boatTypeKey, isGulet, catalogReady]);

  useEffect(() => {
    if (!isGulet) return;
    if (values.manufacturer_brand !== GULET_BRAND_NAME) {
      onChange("manufacturer_brand", GULET_BRAND_NAME);
    }
    setBrandMode("catalog");
    setModelMode("custom");
  }, [isGulet, values.manufacturer_brand, onChange]);

  useEffect(() => {
    if (isGulet) return;
    const brandId = values.manufacturer_brand_id ?? "";
    const brandName = values.manufacturer_brand ?? "";
    if (brandId && brands.some((b) => b.id === brandId)) {
      setSelectedBrandId(brandId);
      setBrandMode("catalog");
    } else if (brandName && !brands.some((b) => b.name === brandName)) {
      setBrandMode("custom");
    }
  }, [boatTypeKey, isGulet, brands, values.manufacturer_brand, values.manufacturer_brand_id]);

  useEffect(() => {
    if (!selectedBrandId || brandMode !== "catalog" || isGulet) {
      setModels([]);
      return;
    }
    let cancelled = false;
    setLoadingModels(true);
    getModelsForBrand(selectedBrandId)
      .then((items) => {
        if (!cancelled) setModels(items);
      })
      .finally(() => {
        if (!cancelled) setLoadingModels(false);
      });
    return () => {
      cancelled = true;
    };
  }, [selectedBrandId, brandMode, isGulet]);

  useEffect(() => {
    if (isGulet) {
      onPendingRequestChange?.(null);
      return;
    }
    if (brandMode === "custom" || modelMode === "custom") {
      onPendingRequestChange?.({
        requestedBrand: values.manufacturer_brand ?? "",
        requestedModel: values.model ?? null,
      });
    } else {
      onPendingRequestChange?.(null);
    }
  }, [
    brandMode,
    modelMode,
    values.manufacturer_brand,
    values.model,
    isGulet,
    onPendingRequestChange,
  ]);

  function selectBrand(brandId: string) {
    if (brandId === NOT_IN_LIST) {
      setBrandMode("custom");
      setSelectedBrandId("");
      setModels([]);
      onChange("manufacturer_brand_id", "");
      onChange("manufacturer_brand", "");
      onChange("model_id", "");
      onChange("model", "");
      return;
    }
    setBrandMode("catalog");
    setModelMode("catalog");
    setSelectedBrandId(brandId);
    const brand = brands.find((b) => b.id === brandId);
    onChange("manufacturer_brand_id", brandId);
    onChange("manufacturer_brand", brand?.name ?? "");
    onChange("model_id", "");
    onChange("model", "");
  }

  function selectModel(modelId: string) {
    if (modelId === NOT_IN_LIST) {
      setModelMode("custom");
      onChange("model_id", "");
      onChange("model", "");
      return;
    }
    setModelMode("catalog");
    const model = models.find((m) => m.id === modelId);
    onChange("model_id", modelId);
    onChange("model", model?.name ?? "");
  }

  if (!boatTypeKey) {
    return (
      <>
        <Field label="Marka">
          <Select disabled value="">
            <option value="">Önce tekne tipi seçin…</option>
          </Select>
        </Field>
        <Field label="Model">
          <Select disabled value="">
            <option value="">Önce marka seçin…</option>
          </Select>
        </Field>
      </>
    );
  }

  if (isGulet) {
    return (
      <>
        <Field label="Marka">
          <Select disabled value={GULET_BRAND_NAME}>
            <option value={GULET_BRAND_NAME}>{GULET_BRAND_NAME}</option>
          </Select>
        </Field>
        <div data-field="model">
          <Field label="Model" hint="Tersane adı ve yapım yılı" error={fieldErrors?.model}>
            <Input
              value={values.model ?? ""}
              error={!!fieldErrors?.model}
              placeholder="Örn. Bodrum Tersanesi, 2019"
              onChange={(e) => onChange("model", e.target.value)}
            />
          </Field>
        </div>
      </>
    );
  }

  return (
    <>
      <div data-field="manufacturer_brand">
        <Field label="Marka" error={fieldErrors?.manufacturer_brand}>
          {brandMode === "custom" ? (
            <Input
              value={values.manufacturer_brand ?? ""}
              error={!!fieldErrors?.manufacturer_brand}
              placeholder="Marka adını yazın"
              onChange={(e) => onChange("manufacturer_brand", e.target.value)}
            />
          ) : (
            <Select
              value={selectedBrandId}
              disabled={!catalogReady}
              error={!!fieldErrors?.manufacturer_brand}
              onChange={(e) => selectBrand(e.target.value)}
            >
            <option value="">
              {!catalogReady ? "Yükleniyor…" : "Marka seçin…"}
            </option>
            {brands.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
            <option value={NOT_IN_LIST}>Listede yok — ekle</option>
          </Select>
        )}
        {brandMode === "custom" ? (
          <button
            type="button"
            className="mt-1 text-sm text-brand-600 hover:underline"
            onClick={() => {
              setBrandMode("catalog");
              onChange("manufacturer_brand", "");
              onChange("manufacturer_brand_id", "");
            }}
          >
            Listeden seç
          </button>
        ) : null}
        </Field>
      </div>

      <div data-field="model">
        <Field label="Model" error={fieldErrors?.model}>
          {brandMode === "custom" || modelMode === "custom" ? (
            <Input
              value={values.model ?? ""}
              error={!!fieldErrors?.model}
              placeholder="Model adını yazın"
              disabled={brandMode === "catalog" && !selectedBrandId}
              onChange={(e) => onChange("model", e.target.value)}
            />
          ) : (
            <Select
              value={values.model_id ?? ""}
              disabled={!selectedBrandId || loadingModels}
              error={!!fieldErrors?.model}
              onChange={(e) => selectModel(e.target.value)}
            >
            <option value="">
              {!selectedBrandId
                ? "Önce marka seçin…"
                : loadingModels
                  ? "Yükleniyor…"
                  : "Model seçin…"}
            </option>
            {models.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
            <option value={NOT_IN_LIST}>Listede yok — ekle</option>
          </Select>
        )}
        </Field>
      </div>
    </>
  );
}
