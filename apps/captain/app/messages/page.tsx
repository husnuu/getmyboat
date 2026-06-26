"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { ConversationDTO } from "@getyourboat/shared";
import { Badge, EmptyState, Skeleton } from "@getyourboat/ui";
import { AppShell } from "../../components/layout/AppShell";
import { api, ApiError } from "../../lib/api";

function formatPreview(body: string | undefined): string {
  if (!body) return "Henüz mesaj yok";
  return body.length > 80 ? `${body.slice(0, 80)}…` : body;
}

function formatTime(value: string | Date | null | undefined): string {
  if (!value) return "";
  const d = new Date(value);
  return d.toLocaleString("tr-TR", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function MessagesContent() {
  const [items, setItems] = useState<ConversationDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const data = await api.listConversations();
        if (active) setItems(data.items);
      } catch (err) {
        if (active) {
          setError(err instanceof ApiError ? err.message : "Mesajlar yüklenemedi");
        }
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    );
  }

  if (error) {
    return <p className="text-sm text-red-600">{error}</p>;
  }

  if (items.length === 0) {
    return (
      <EmptyState
        title="Henüz mesaj yok"
        description="Rezervasyonlarınızdan gelen müşteri mesajları burada görünecek."
      />
    );
  }

  return (
    <ul className="divide-y divide-gray-200 overflow-hidden rounded-xl border border-gray-200 bg-white">
      {items.map((item) => (
        <li key={item.id}>
          <Link
            href={`/messages/${item.id}`}
            className="flex items-start gap-4 px-4 py-4 transition hover:bg-gray-50"
          >
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <p className="truncate font-medium text-gray-900">{item.customerName}</p>
                <span className="shrink-0 text-xs text-gray-500">
                  {formatTime(item.lastMessage?.createdAt ?? item.updatedAt)}
                </span>
              </div>
              {item.boatTitle ? (
                <p className="truncate text-xs text-gray-500">{item.boatTitle}</p>
              ) : null}
              <p className="mt-1 truncate text-sm text-gray-600">
                {formatPreview(item.lastMessage?.body)}
              </p>
            </div>
            {item.unreadCount > 0 ? (
              <Badge variant="brand">{item.unreadCount}</Badge>
            ) : null}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default function MessagesPage() {
  return (
    <AppShell active="messages">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Mesajlar</h1>
        <p className="mt-1 text-sm text-gray-600">Müşterilerinizle rezervasyon bazlı sohbetler</p>
      </div>
      <MessagesContent />
    </AppShell>
  );
}
