"use client";

import {
  EXPERIENCE_CATEGORY_LABELS,
  EXPERIENCE_STATUS_LABELS,
  EXPERIENCE_STEP_LABELS,
  EXPERIENCE_STEP_ORDER,
  ExperienceStatus,
  experienceStepIndex,
} from "@getyourboat/shared";

export {
  EXPERIENCE_CATEGORY_LABELS,
  EXPERIENCE_STATUS_LABELS,
  EXPERIENCE_STEP_LABELS,
  EXPERIENCE_STEP_ORDER,
  ExperienceStatus,
  experienceStepIndex,
};

export const EXPERIENCE_STATUS_VARIANT: Record<
  ExperienceStatus,
  "neutral" | "warning" | "success" | "danger" | "brand"
> = {
  [ExperienceStatus.DRAFT]: "neutral",
  [ExperienceStatus.PENDING_REVIEW]: "warning",
  [ExperienceStatus.CHANGES_REQUESTED]: "warning",
  [ExperienceStatus.APPROVED]: "brand",
  [ExperienceStatus.ACTIVE]: "success",
  [ExperienceStatus.PAUSED]: "neutral",
  [ExperienceStatus.REJECTED]: "danger",
};
