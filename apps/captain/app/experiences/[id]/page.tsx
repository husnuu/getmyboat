"use client";

import { AppShell } from "../../../components/layout/AppShell";
import { ExperienceWizard } from "../../../components/experiences/ExperienceWizard";
import { useParams } from "next/navigation";

export default function ExperienceEditPage() {
  const params = useParams<{ id: string }>();
  return (
    <AppShell active="experiences">
      <ExperienceWizard experienceId={params.id} />
    </AppShell>
  );
}
