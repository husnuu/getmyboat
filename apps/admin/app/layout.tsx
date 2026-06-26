import type { Metadata } from "next";
import { AdminAppLayout } from "../components/AdminAppLayout";
import "./globals.css";

export const metadata: Metadata = {
  title: "GetYourBoat — Admin",
  description: "Moderation and management console",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body>
        <AdminAppLayout>{children}</AdminAppLayout>
      </body>
    </html>
  );
}
