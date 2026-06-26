"use client";

import { Alert, StatCard, type StatAccent } from "@getyourboat/ui";
import type { DashboardStatsDTO } from "@getyourboat/shared";

interface StatGridProps {
  stats?: DashboardStatsDTO;
  loading: boolean;
  error: boolean;
}

function formatMoney(amount: number, currency: string): string {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function StatGrid({ stats, loading, error }: StatGridProps) {
  if (error) {
    return <Alert variant="danger">İstatistikler yüklenemedi. Lütfen tekrar dene.</Alert>;
  }

  const cards: { label: string; value: string; accent: StatAccent; hint?: string }[] = [
    {
      label: "Toplam Kazanç",
      value: stats ? formatMoney(stats.totalEarning.amount, stats.totalEarning.currency) : "—",
      accent: "brand",
    },
    {
      label: "Onay Bekleyen Müsaitlik",
      value: stats ? String(stats.availabilityAwaiting) : "—",
      accent: "info",
    },
    {
      label: "Onaylanan Müsaitlik",
      value: stats ? String(stats.availabilityConfirmed) : "—",
      accent: "success",
    },
    {
      label: "Opsiyonlu",
      value: stats ? String(stats.optioned) : "—",
      accent: "warning",
    },
    {
      label: "Aktif Tekneler",
      value: stats ? String(stats.activeBoats) : "—",
      accent: "ink",
    },
    {
      label: "Puan",
      value: stats?.rating.average != null ? stats.rating.average.toFixed(1) : "–",
      accent: "danger",
      hint: stats ? `${stats.rating.count} değerlendirme` : undefined,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
      {cards.map((c) => (
        <StatCard
          key={c.label}
          label={c.label}
          value={c.value}
          accent={c.accent}
          hint={c.hint}
          loading={loading}
        />
      ))}
    </div>
  );
}
