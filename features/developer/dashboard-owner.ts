import type { User } from "firebase/auth";
import type { UserData } from "@/types/user";

export function developerOwnerUid(user: User | null, userData: UserData | null): string {
  if (userData?.role === "developer") return String(user?.uid || "").trim();
  if (userData?.role === "employee") return String(userData.developerUid || "").trim();
  return "";
}
