import { RequireAuth } from "@/features/auth/RequireAuth";
import { AdminShell } from "@/features/admin/components/AdminShell";
import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RequireAuth allowedRoles={["admin", "superAdmin"]}>
      <AdminShell>{children}</AdminShell>
    </RequireAuth>
  );
}
