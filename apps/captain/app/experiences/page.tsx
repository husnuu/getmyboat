"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { ExperienceListItemDTO } from "@getyourboat/shared";
import { ExperienceStatus } from "@getyourboat/shared";
import {
  Badge,
  Button,
  EmptyState,
  FontAwesomeIcon,
  Skeleton,
  faPenToSquare,
  faStar,
  faTrash,
} from "@getyourboat/ui";
import { AppShell } from "../../components/layout/AppShell";
import { api, ApiError } from "../../lib/api";
import {
  EXPERIENCE_CATEGORY_LABELS,
  EXPERIENCE_STATUS_LABELS,
  EXPERIENCE_STATUS_VARIANT,
} from "../../lib/experience";
import { Alert } from "../../components/ui";

function ExperiencesContent() {
  const router = useRouter();
  const [items, setItems] = useState<ExperienceListItemDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);

  async function load() {
    try {
      const data = await api.myExperiences();
      setItems(data.items);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Deneyimler yüklenemedi");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  async function createNew() {
    setCreating(true);
    setError(null);
    try {
      const exp = await api.createExperience();
      router.push(`/experiences/${exp.id}`);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Deneyim oluşturulamadı");
      setCreating(false);
    }
  }

  async function toggleStatus(item: ExperienceListItemDTO) {
    setBusyId(item.id);
    try {
      const next =
        item.status === ExperienceStatus.ACTIVE ? ExperienceStatus.PAUSED : ExperienceStatus.ACTIVE;
      await api.toggleExperienceStatus(item.id, next);
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Durum güncellenemedi");
    } finally {
      setBusyId(null);
    }
  }

  async function remove(item: ExperienceListItemDTO) {
    if (!window.confirm(`"${item.title}" silinsin mi?`)) return;
    setBusyId(item.id);
    try {
      await api.deleteExperience(item.id);
      setItems((prev) => prev.filter((x) => x.id !== item.id));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Silinemedi");
    } finally {
      setBusyId(null);
    }
  }

  const toggleable = new Set<ExperienceStatus>([
    ExperienceStatus.APPROVED,
    ExperienceStatus.ACTIVE,
    ExperienceStatus.PAUSED,
  ]);
  const canToggle = (status: ExperienceStatus) => toggleable.has(status);

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Deneyimler</h1>
          <p className="mt-1 text-sm text-gray-600">Tekneden bağımsız tur ve aktivite ilanları</p>
        </div>
        <Button onClick={() => void createNew()} disabled={creating}>
          <FontAwesomeIcon icon={faStar} className="mr-2" />
          {creating ? "Oluşturuluyor…" : "Yeni Deneyim Ekle"}
        </Button>
      </div>

      {error ? <Alert variant="danger">{error}</Alert> : null}

      {loading ? (
        <div className="space-y-3">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      ) : items.length === 0 ? (
        <EmptyState
          title="Henüz deneyim yok"
          description="GetYourGuide tarzı turlar, su sporları ve aktiviteler ekleyebilirsin."
        />
      ) : (
        <ul className="space-y-3">
          {items.map((item) => (
            <li
              key={item.id}
              className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-gray-200 bg-white p-4"
            >
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="truncate font-medium text-gray-900">{item.title}</p>
                  <Badge variant={EXPERIENCE_STATUS_VARIANT[item.status]}>
                    {EXPERIENCE_STATUS_LABELS[item.status]}
                  </Badge>
                </div>
                {item.category ? (
                  <p className="text-sm text-gray-500">{EXPERIENCE_CATEGORY_LABELS[item.category]}</p>
                ) : null}
                {item.basePrice > 0 ? (
                  <p className="mt-1 text-sm text-gray-700">
                    {item.basePrice} {item.currency}
                  </p>
                ) : null}
              </div>
              <div className="flex flex-wrap gap-2">
                {canToggle(item.status) ? (
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={busyId === item.id}
                    onClick={() => void toggleStatus(item)}
                  >
                    {item.status === ExperienceStatus.ACTIVE ? "Duraklat" : "Yayına al"}
                  </Button>
                ) : null}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => router.push(`/experiences/${item.id}`)}
                >
                  <FontAwesomeIcon icon={faPenToSquare} className="mr-1" />
                  Düzenle
                </Button>
                {item.status !== ExperienceStatus.ACTIVE ? (
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={busyId === item.id}
                    onClick={() => void remove(item)}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </Button>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

export default function ExperiencesPage() {
  return (
    <AppShell active="experiences">
      <ExperiencesContent />
    </AppShell>
  );
}
