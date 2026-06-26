"use client";

import {
  CANCELLATION_POLICY_LABELS,
  CancellationPolicyType,
  EXPERIENCE_CATEGORY_LABELS,
  EXPERIENCE_PRICING_TYPE_LABELS,
  ExperienceCategory,
  ExperienceDTO,
  ExperiencePricingType,
  ExperienceStep,
} from "@getyourboat/shared";
import { Button } from "@getyourboat/ui";
import { useState } from "react";
import { api, ApiError, uploadToStorage } from "../../lib/api";
import { Alert, Field, Input, Label, Select, Textarea } from "../ui";
import { LinesField, StepShell } from "./form-utils";

export interface ExperienceStepProps {
  experience: ExperienceDTO;
  onSaved: (next: ExperienceDTO) => void;
  onNext: () => void;
}

function useStepSave(step: ExperienceStep) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function save(id: string, body: unknown, onSaved: (next: ExperienceDTO) => void) {
    setSaving(true);
    setError(null);
    try {
      const next = await api.updateExperienceStep(id, step, body);
      onSaved(next);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Kaydedilemedi");
    } finally {
      setSaving(false);
    }
  }

  return { saving, error, save };
}

export function CategoryStep({ experience, onSaved, onNext }: ExperienceStepProps) {
  const [category, setCategory] = useState(experience.category ?? ExperienceCategory.BOAT_TOUR);
  const { saving, error, save } = useStepSave(ExperienceStep.CATEGORY);

  return (
    <StepShell title="Kategori" description="Deneyiminin türünü seç." error={error}>
      <Field>
        <Label>Kategori *</Label>
        <Select value={category} onChange={(e) => setCategory(e.target.value as ExperienceCategory)}>
          {Object.entries(EXPERIENCE_CATEGORY_LABELS).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </Select>
      </Field>
      <Button
        onClick={() => void save(experience.id, { category }, (next) => { onSaved(next); onNext(); })}
        disabled={saving}
      >
        {saving ? "Kaydediliyor…" : "Devam et"}
      </Button>
    </StepShell>
  );
}

export function TitleDescriptionStep({ experience, onSaved, onNext }: ExperienceStepProps) {
  const [title, setTitle] = useState(experience.title);
  const [shortDescription, setShortDescription] = useState(experience.shortDescription);
  const [fullDescription, setFullDescription] = useState(experience.fullDescription);
  const [highlights, setHighlights] = useState(experience.highlights);
  const [keywords, setKeywords] = useState(experience.keywords);
  const { saving, error, save } = useStepSave(ExperienceStep.TITLE_DESCRIPTION);

  return (
    <StepShell
      title="Başlık & Açıklama"
      description="Başlık konum adıyla başlamalı (örn. Bodrum Gün Batımı Yelken Turu)."
      error={error}
    >
      <Field>
        <Label>Başlık *</Label>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} />
      </Field>
      <Field>
        <Label>Kısa açıklama *</Label>
        <Textarea rows={3} value={shortDescription} onChange={(e) => setShortDescription(e.target.value)} />
      </Field>
      <Field>
        <Label>Tam açıklama *</Label>
        <Textarea rows={6} value={fullDescription} onChange={(e) => setFullDescription(e.target.value)} />
      </Field>
      <LinesField label="Öne çıkanlar" value={highlights} onChange={setHighlights} required />
      <LinesField label="Anahtar kelimeler" value={keywords} onChange={setKeywords} />
      <Button
        onClick={() =>
          void save(
            experience.id,
            { title, shortDescription, fullDescription, highlights, keywords },
            (next) => { onSaved(next); onNext(); }
          )
        }
        disabled={saving}
      >
        {saving ? "Kaydediliyor…" : "Devam et"}
      </Button>
    </StepShell>
  );
}

export function IncludedInfoStep({ experience, onSaved, onNext }: ExperienceStepProps) {
  const [included, setIncluded] = useState(experience.included);
  const [notIncluded, setNotIncluded] = useState(experience.notIncluded);
  const [notAllowed, setNotAllowed] = useState(experience.notAllowed);
  const [knowBeforeYouGo, setKnowBeforeYouGo] = useState(experience.knowBeforeYouGo);
  const [emergencyContactPhone, setEmergencyContactPhone] = useState(
    experience.emergencyContactPhone ?? ""
  );
  const { saving, error, save } = useStepSave(ExperienceStep.INCLUDED_INFO);

  return (
    <StepShell title="Dahil / Hariç / Bilgilendirme" error={error}>
      <LinesField label="Dahil olanlar" value={included} onChange={setIncluded} required />
      <LinesField label="Dahil olmayanlar" value={notIncluded} onChange={setNotIncluded} />
      <LinesField label="Yasak olanlar" value={notAllowed} onChange={setNotAllowed} />
      <LinesField label="Gitmeden bilinmesi gerekenler" value={knowBeforeYouGo} onChange={setKnowBeforeYouGo} />
      <Field>
        <Label>Acil durum telefonu</Label>
        <Input value={emergencyContactPhone} onChange={(e) => setEmergencyContactPhone(e.target.value)} />
      </Field>
      <Button
        onClick={() =>
          void save(
            experience.id,
            {
              included,
              notIncluded,
              notAllowed,
              knowBeforeYouGo,
              emergencyContactPhone: emergencyContactPhone || null,
            },
            (next) => { onSaved(next); onNext(); }
          )
        }
        disabled={saving}
      >
        {saving ? "Kaydediliyor…" : "Devam et"}
      </Button>
    </StepShell>
  );
}

export function LogisticsStep({ experience, onSaved, onNext }: ExperienceStepProps) {
  const [durationMinutes, setDurationMinutes] = useState(String(experience.durationMinutes));
  const [meetingPoint, setMeetingPoint] = useState(experience.meetingPoint);
  const [meetingPointLat, setMeetingPointLat] = useState(
    experience.meetingPointLat != null ? String(experience.meetingPointLat) : ""
  );
  const [meetingPointLng, setMeetingPointLng] = useState(
    experience.meetingPointLng != null ? String(experience.meetingPointLng) : ""
  );
  const [meetingTime, setMeetingTime] = useState(experience.meetingTime);
  const [languages, setLanguages] = useState(experience.languages.length ? experience.languages : ["Türkçe"]);
  const [minParticipants, setMinParticipants] = useState(String(experience.minParticipants));
  const [maxParticipants, setMaxParticipants] = useState(String(experience.maxParticipants));
  const [requiredEquipment, setRequiredEquipment] = useState(experience.requiredEquipment);
  const [accessibilityInfo, setAccessibilityInfo] = useState(experience.accessibilityInfo ?? "");
  const { saving, error, save } = useStepSave(ExperienceStep.LOGISTICS);

  return (
    <StepShell title="Lojistik" error={error}>
      <Field>
        <Label>Süre (dakika) *</Label>
        <Input type="number" value={durationMinutes} onChange={(e) => setDurationMinutes(e.target.value)} />
      </Field>
      <Field>
        <Label>Buluşma noktası *</Label>
        <Input value={meetingPoint} onChange={(e) => setMeetingPoint(e.target.value)} />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field>
          <Label>Enlem (opsiyonel)</Label>
          <Input value={meetingPointLat} onChange={(e) => setMeetingPointLat(e.target.value)} />
        </Field>
        <Field>
          <Label>Boylam (opsiyonel)</Label>
          <Input value={meetingPointLng} onChange={(e) => setMeetingPointLng(e.target.value)} />
        </Field>
      </div>
      <Field>
        <Label>Buluşma saati *</Label>
        <Input value={meetingTime} onChange={(e) => setMeetingTime(e.target.value)} placeholder="örn. 10:00" />
      </Field>
      <LinesField label="Diller" value={languages} onChange={setLanguages} required />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field>
          <Label>Min katılımcı *</Label>
          <Input type="number" value={minParticipants} onChange={(e) => setMinParticipants(e.target.value)} />
        </Field>
        <Field>
          <Label>Maks katılımcı *</Label>
          <Input type="number" value={maxParticipants} onChange={(e) => setMaxParticipants(e.target.value)} />
        </Field>
      </div>
      <LinesField label="Gerekli ekipman / beceriler" value={requiredEquipment} onChange={setRequiredEquipment} />
      <Field>
        <Label>Erişilebilirlik bilgisi</Label>
        <Textarea rows={3} value={accessibilityInfo} onChange={(e) => setAccessibilityInfo(e.target.value)} />
      </Field>
      <Button
        onClick={() =>
          void save(
            experience.id,
            {
              durationMinutes: Number(durationMinutes),
              meetingPoint,
              meetingPointLat: meetingPointLat ? Number(meetingPointLat) : null,
              meetingPointLng: meetingPointLng ? Number(meetingPointLng) : null,
              meetingTime,
              languages,
              minParticipants: Number(minParticipants),
              maxParticipants: Number(maxParticipants),
              requiredEquipment,
              accessibilityInfo: accessibilityInfo || null,
            },
            (next) => { onSaved(next); onNext(); }
          )
        }
        disabled={saving}
      >
        {saving ? "Kaydediliyor…" : "Devam et"}
      </Button>
    </StepShell>
  );
}

export function PricingStep({ experience, onSaved, onNext }: ExperienceStepProps) {
  const [basePrice, setBasePrice] = useState(String(experience.basePrice || ""));
  const [currency, setCurrency] = useState(experience.currency || "EUR");
  const [pricingType, setPricingType] = useState(experience.pricingType);
  const [childDiscountPercent, setChildDiscountPercent] = useState(
    experience.childDiscountPercent != null ? String(experience.childDiscountPercent) : ""
  );
  const { saving, error, save } = useStepSave(ExperienceStep.PRICING);

  return (
    <StepShell title="Fiyatlandırma" error={error}>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field>
          <Label>Temel fiyat *</Label>
          <Input type="number" min="0" step="0.01" value={basePrice} onChange={(e) => setBasePrice(e.target.value)} />
        </Field>
        <Field>
          <Label>Para birimi *</Label>
          <Input value={currency} onChange={(e) => setCurrency(e.target.value.toUpperCase())} maxLength={3} />
        </Field>
      </div>
      <Field>
        <Label>Fiyatlandırma tipi *</Label>
        <Select value={pricingType} onChange={(e) => setPricingType(e.target.value as ExperiencePricingType)}>
          {Object.entries(EXPERIENCE_PRICING_TYPE_LABELS).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </Select>
      </Field>
      <Field>
        <Label>Çocuk indirimi (%)</Label>
        <Input
          type="number"
          min="0"
          max="100"
          value={childDiscountPercent}
          onChange={(e) => setChildDiscountPercent(e.target.value)}
        />
      </Field>
      <Button
        onClick={() =>
          void save(
            experience.id,
            {
              basePrice: Number(basePrice),
              currency,
              pricingType,
              childDiscountPercent: childDiscountPercent ? Number(childDiscountPercent) : null,
            },
            (next) => { onSaved(next); onNext(); }
          )
        }
        disabled={saving}
      >
        {saving ? "Kaydediliyor…" : "Devam et"}
      </Button>
    </StepShell>
  );
}

export function CancellationStep({ experience, onSaved, onNext }: ExperienceStepProps) {
  const [cancellationPolicy, setCancellationPolicy] = useState(experience.cancellationPolicy);
  const [cancellationPolicyText, setCancellationPolicyText] = useState(
    experience.cancellationPolicyText ?? ""
  );
  const { saving, error, save } = useStepSave(ExperienceStep.CANCELLATION);

  return (
    <StepShell
      title="İptal Politikası"
      description="Tam açıklamadaki iptal koşulları bu seçimle çelişmemeli."
      error={error}
    >
      <Field>
        <Label>İptal politikası *</Label>
        <Select
          value={cancellationPolicy}
          onChange={(e) => setCancellationPolicy(e.target.value as CancellationPolicyType)}
        >
          {Object.entries(CANCELLATION_POLICY_LABELS).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </Select>
      </Field>
      {cancellationPolicy === CancellationPolicyType.CUSTOM ? (
        <Field>
          <Label>Özel iptal metni *</Label>
          <Textarea rows={4} value={cancellationPolicyText} onChange={(e) => setCancellationPolicyText(e.target.value)} />
        </Field>
      ) : null}
      <Button
        onClick={() =>
          void save(
            experience.id,
            {
              cancellationPolicy,
              cancellationPolicyText:
                cancellationPolicy === CancellationPolicyType.CUSTOM
                  ? cancellationPolicyText
                  : null,
            },
            (next) => { onSaved(next); onNext(); }
          )
        }
        disabled={saving}
      >
        {saving ? "Kaydediliyor…" : "Devam et"}
      </Button>
    </StepShell>
  );
}

export function MediaStep({ experience, onSaved, onNext }: ExperienceStepProps) {
  const [videoUrl, setVideoUrl] = useState(experience.videoUrl ?? "");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { saving, error: saveError, save } = useStepSave(ExperienceStep.MEDIA);

  async function handleUpload(file: File, asCover?: boolean) {
    setUploading(true);
    setError(null);
    try {
      const upload = await api.experiencePhotoUploadUrl(experience.id, file.name);
      await uploadToStorage(upload, file);
      const next = await api.registerExperiencePhoto(experience.id, {
        storagePath: upload.path,
        asCover,
      });
      onSaved(next);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Fotoğraf yüklenemedi");
    } finally {
      setUploading(false);
    }
  }

  return (
    <StepShell
      title="Medya"
      description="Kapak fotoğrafı zorunlu. Galeri için en az 5 foto önerilir."
      error={error || saveError}
    >
      {experience.coverPhotoUrl ? (
        <img src={experience.coverPhotoUrl} alt="Kapak" className="h-40 w-full rounded-xl object-cover" />
      ) : (
        <Alert variant="info">Kapak fotoğrafı henüz yüklenmedi.</Alert>
      )}

      <Field>
        <Label>Kapak fotoğrafı yükle</Label>
        <Input
          type="file"
          accept="image/*"
          disabled={uploading}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void handleUpload(file, true);
          }}
        />
      </Field>

      <Field>
        <Label>Galeri fotoğrafı ekle</Label>
        <Input
          type="file"
          accept="image/*"
          disabled={uploading}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void handleUpload(file, false);
          }}
        />
      </Field>

      {experience.photoUrls.length > 0 ? (
        <div className="grid grid-cols-3 gap-2">
          {experience.photoUrls.map((url) => (
            <img key={url} src={url} alt="" className="h-24 w-full rounded-lg object-cover" />
          ))}
        </div>
      ) : null}

      <Field>
        <Label>Video URL (opsiyonel)</Label>
        <Input value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} placeholder="https://..." />
      </Field>

      <Button
        onClick={() =>
          void save(
            experience.id,
            {
              coverPhotoUrl: experience.coverPhotoUrl,
              photoUrls: experience.photoUrls,
              videoUrl: videoUrl || null,
            },
            (next) => { onSaved(next); onNext(); }
          )
        }
        disabled={saving || !experience.coverPhotoUrl}
      >
        {saving ? "Kaydediliyor…" : "Devam et"}
      </Button>
    </StepShell>
  );
}

export const EXPERIENCE_STEP_COMPONENTS = {
  CATEGORY: CategoryStep,
  TITLE_DESCRIPTION: TitleDescriptionStep,
  INCLUDED_INFO: IncludedInfoStep,
  LOGISTICS: LogisticsStep,
  PRICING: PricingStep,
  CANCELLATION: CancellationStep,
  MEDIA: MediaStep,
} as const;
