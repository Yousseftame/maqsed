import { RequireAuth } from "@/features/auth/RequireAuth";
import { AdminShell } from "@/features/admin/components/AdminShell";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RequireAuth allowedRoles={["admin"]}>
      <AdminShell>{children}</AdminShell>
    </RequireAuth>
  );
}
