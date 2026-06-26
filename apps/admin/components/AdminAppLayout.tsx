"use client";

import { usePathname } from "next/navigation";
import { AdminShell } from "./AdminShell";

export function AdminAppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname === "/login") return <>{children}</>;
  return <AdminShell>{children}</AdminShell>;
}
