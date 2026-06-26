"use client";

import {
  Badge,
  Button,
  FontAwesomeIcon,
  faPaperPlane,
} from "@getyourboat/ui";
import { ExperienceStatus, ExperienceStep } from "@getyourboat/shared";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { api, ApiError } from "../../lib/api";
import {
  EXPERIENCE_STATUS_LABELS,
  EXPERIENCE_STATUS_VARIANT,
  EXPERIENCE_STEP_LABELS,
  EXPERIENCE_STEP_ORDER,
  experienceStepIndex,
} from "../../lib/experience";
import type { ExperienceDTO } from "@getyourboat/shared";
import { Alert, Spinner } from "../ui";
import { Stepper, type StepperItem } from "../wizard/Stepper";
import { EXPERIENCE_STEP_COMPONENTS } from "./steps";

export function ExperienceWizard({ experienceId }: { experienceId: string }) {
  const router = useRouter();
  const [experience, setExperience] = useState<ExperienceDTO | null>(null);
  const [active, setActive] = useState<ExperienceStep>(ExperienceStep.CATEGORY);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const data = await api.getExperience(experienceId);
        if (!alive) return;
        setExperience(data);
        setActive(data.progress.currentStep);
      } catch (err) {
        if (alive) setError(err instanceof ApiError ? err.message : "Deneyim yüklenemedi");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [experienceId]);

  const stepperItems = useMemo<StepperItem[]>(() => {
    if (!experience) return [];
    const completed = new Set(experience.progress.completedSteps);
    const activeIdx = experienceStepIndex(active);
    return EXPERIENCE_STEP_ORDER.map((step, idx) => ({
      id: step,
      label: EXPERIENCE_STEP_LABELS[step],
      done: completed.has(step),
      reachable: idx <= activeIdx || completed.has(step),
    }));
  }, [experience, active]);

  async function handleSubmit() {
    if (!experience) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const next = await api.submitExperience(experience.id);
      setExperience(next);
      router.push("/experiences");
    } catch (err) {
      setSubmitError(err instanceof ApiError ? err.message : "Gönderilemedi");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner />
      </div>
    );
  }

  if (error || !experience) {
    return <Alert variant="danger">{error ?? "Deneyim bulunamadı"}</Alert>;
  }

  const StepComponent = EXPERIENCE_STEP_COMPONENTS[active];
  const canSubmit =
    experience.progress.isReadyForSubmit &&
    experience.status !== ExperienceStatus.PENDING_REVIEW &&
    experience.status !== ExperienceStatus.ACTIVE;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            {experience.title || "Yeni Deneyim"}
          </h1>
          <Badge variant={EXPERIENCE_STATUS_VARIANT[experience.status]} className="mt-2">
            {EXPERIENCE_STATUS_LABELS[experience.status]}
          </Badge>
          {experience.reviewNote ? (
            <p className="mt-2 text-sm text-amber-700">{experience.reviewNote}</p>
          ) : null}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push("/experiences")}>
            Listeye dön
          </Button>
          {canSubmit ? (
            <Button onClick={() => void handleSubmit()} disabled={submitting}>
              <FontAwesomeIcon icon={faPaperPlane} className="mr-2" />
              {submitting ? "Gönderiliyor…" : "İncelemeye gönder"}
            </Button>
          ) : null}
        </div>
      </div>

      <Stepper items={stepperItems} currentId={active} onSelect={(id) => setActive(id as ExperienceStep)} />

      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <StepComponent
          experience={experience}
          onSaved={setExperience}
          onNext={() => {
            const idx = experienceStepIndex(active);
            const next = EXPERIENCE_STEP_ORDER[idx + 1];
            if (next) setActive(next);
          }}
        />
      </div>

      {submitError ? <Alert variant="danger">{submitError}</Alert> : null}
    </div>
  );
}
