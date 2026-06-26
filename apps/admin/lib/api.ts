import {
  BoatBrandCategory,
  BOAT_BRAND_CATEGORY_LABELS,
  type BoatBrandDTO,
  type BoatModelDTO,
  type BrandModelRequestDTO,
  type CreateBrandModelRequestInput,
} from "@getyourboat/shared";
import { getAdminToken, setAdminToken } from "./auth";

const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";
const V1 = `${BASE}/api/v1`;

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

async function request<T>(
  path: string,
  options: { method?: string; body?: unknown; auth?: boolean } = {}
): Promise<T> {
  const { method = "GET", body, auth = true } = options;
  const headers: Record<string, string> = {};
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (auth) {
    const token = getAdminToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${V1}${path}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
    cache: "no-store",
  });

  const text = await res.text();
  const data = text ? JSON.parse(text) : null;
  if (!res.ok) {
    throw new ApiError(res.status, (data && data.message) || `Request failed (${res.status})`);
  }
  return data as T;
}

export const api = {
  login: async (email: string, password: string) => {
    const data = await request<{ accessToken: string; user: { role: string } }>(
      "/auth/login",
      { method: "POST", body: { email, password }, auth: false }
    );
    if (data.user.role !== "ADMIN") {
      throw new ApiError(403, "Admin hesabı gerekli");
    }
    setAdminToken(data.accessToken);
    return data;
  },
  logout: () => {
    setAdminToken(null);
  },

  listBrands: (category?: BoatBrandCategory) => {
    const qs = category ? `?category=${encodeURIComponent(category)}` : "";
    return request<{ items: BoatBrandDTO[] }>(`/admin/boat-brands${qs}`);
  },
  createBrand: (body: { name: string; category: BoatBrandCategory; logoUrl?: string | null }) =>
    request<BoatBrandDTO>("/admin/boat-brands", { method: "POST", body }),
  listModels: (brandId: string) =>
    request<{ items: BoatModelDTO[] }>(`/admin/boat-brands/${brandId}/models`),
  createModel: (body: { brandId: string; name: string; notes?: string | null }) =>
    request<BoatModelDTO>("/admin/boat-models", { method: "POST", body }),

  listRequests: (status = "PENDING") =>
    request<{ items: BrandModelRequestDTO[] }>(
      `/admin/brand-model-requests?status=${encodeURIComponent(status)}`
    ),
  approveRequest: (id: string, category?: BoatBrandCategory) =>
    request<BrandModelRequestDTO>(`/admin/brand-model-requests/${id}/approve`, {
      method: "POST",
      body: category ? { category } : {},
    }),
  rejectRequest: (id: string) =>
    request<BrandModelRequestDTO>(`/admin/brand-model-requests/${id}/reject`, {
      method: "POST",
      body: {},
    }),
};

export { BoatBrandCategory, BOAT_BRAND_CATEGORY_LABELS };
export type { BoatBrandDTO, BoatModelDTO, BrandModelRequestDTO, CreateBrandModelRequestInput };
