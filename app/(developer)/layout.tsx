"use client";

import { RequireAuth } from "@/features/auth/RequireAuth";
import { DeveloperShell } from "@/features/developer/components/DeveloperShell";

export default function DeveloperLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RequireAuth allowedRoles={["developer"]}>
      <DeveloperShell>{children}</DeveloperShell>
    </RequireAuth>
  );
}
