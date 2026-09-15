"use client";

import { RequireAuth } from "@/features/auth/RequireAuth";
import { DeveloperShell } from "@/features/developer/components/DeveloperShell";

export function DeveloperLayoutClient({ children }: { children: React.ReactNode }) {
  return (
    <RequireAuth allowedRoles={["developer", "employee"]}>
      <DeveloperShell>{children}</DeveloperShell>
    </RequireAuth>
  );
}
