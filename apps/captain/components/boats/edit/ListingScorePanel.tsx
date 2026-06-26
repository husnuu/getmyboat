"use client";

import {
  STEP_INFO_CARDS,
  buildWizardStepProgress,
  calculateWizardListingScore,
  deriveCompletedWizardSteps,
  resolveStepInfoCardKey,
} from "@getyourboat/shared";
import { cn, FontAwesomeIcon, faCheck } from "@getyourboat/ui";
import type { FeatureSubTabId, OnboardingStep } from "@getyourboat/shared";
import type { SerializedBoat } from "../../../lib/types";
import { STEP_LABELS } from "../../../lib/onboarding";

interface ListingScorePanelProps {
  boat: SerializedBoat;
  activeStep: OnboardingStep | "PREVIEW";
  featureSubTab?: FeatureSubTabId;
}

export function ListingScorePanel({
  boat,
  activeStep,
  featureSubTab,
}: ListingScorePanelProps) {
  const completed = deriveCompletedWizardSteps(boat);
  const percent = calculateWizardListingScore(completed);
  const steps = buildWizardStepProgress(completed, activeStep);
  const tip = STEP_INFO_CARDS[resolveStepInfoCardKey(activeStep, featureSubTab)];
  const activeLabel =
    activeStep === "PREVIEW"
      ? "Önizleme"
      : STEP_LABELS[activeStep as OnboardingStep];

  return (
    <div className="lg:sticky lg:top-24">
      <div className="overflow-hidden rounded-2xl border border-gray-200/70 bg-white shadow-[0_1px_3px_rgba(26,26,46,0.06)]">
        {/* Score header */}
        <div className="px-5 pb-4 pt-5">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-400">
                Listing Score
              </p>
              <p className="mt-2 text-[13px] leading-snug text-gray-500">
                Şu an:{" "}
                <span className="font-medium text-ink">{activeLabel}</span>
              </p>
            </div>
            <div className="text-right">
              <p className="text-[2rem] font-bold tabular-nums leading-none tracking-tight text-ink">
                {percent}
                <span className="ml-0.5 text-base font-semibold text-gray-300">%</span>
              </p>
            </div>
          </div>

          <div
            className="mt-4 h-1 overflow-hidden rounded-full bg-gray-100"
            role="progressbar"
            aria-valuenow={percent}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className="h-full rounded-full bg-ink transition-all duration-700 ease-out"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>

        {/* Wizard steps — üst stepper ile aynı sıra */}
        <ul className="border-t border-gray-100 px-2 py-2">
          {steps.map(({ step, done, current }, index) => (
            <li key={step}>
              <div
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors",
                  current && "bg-gray-50"
                )}
              >
                <span
                  className={cn(
                    "flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full text-[10px] font-bold transition-colors",
                    done
                      ? "bg-emerald-500 text-white"
                      : current
                        ? "bg-ink text-white"
                        : "border border-gray-200 bg-white text-gray-400"
                  )}
                >
                  {done ? (
                    <FontAwesomeIcon icon={faCheck} className="text-[10px]" aria-hidden />
                  ) : (
                    index + 1
                  )}
                </span>
                <span
                  className={cn(
                    "flex-1 text-[13px] leading-tight",
                    done && !current && "text-gray-500",
                    current && "font-semibold text-ink",
                    !done && !current && "text-gray-400"
                  )}
                >
                  {STEP_LABELS[step]}
                </span>
                {current ? (
                  <span className="shrink-0 rounded-full bg-brand-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-brand-600">
                    Aktif
                  </span>
                ) : null}
              </div>
            </li>
          ))}
        </ul>

        {/* Context tip */}
        <div className="border-t border-gray-100 bg-[#fafafa] px-5 py-4">
          <p className="text-[13px] font-semibold text-ink">{tip.title}</p>
          <p className="mt-1.5 text-[12px] leading-relaxed text-gray-500">{tip.description}</p>
        </div>
      </div>
    </div>
  );
}
