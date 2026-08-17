import { RequireAuth } from "@/features/auth/RequireAuth";

export default function DeveloperLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RequireAuth>{children}</RequireAuth>;
}
