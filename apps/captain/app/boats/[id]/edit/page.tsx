"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { Spinner } from "../../../../components/ui";

/** Legacy route — always opens the real onboarding wizard for this boat. */
export default function EditBoatRedirectPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  useEffect(() => {
    router.replace(`/boats/${id}`);
  }, [id, router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Spinner className="h-6 w-6" />
    </div>
  );
}
