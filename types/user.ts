export type UserRole = "admin" | "developer" | "user";

export interface DeveloperStats {
  projectsCount: number;
  unitsCount: number;
}

export interface UserAuditLog {
  id?: string;
  action: "login" | "logout";
  timestamp: number;
  ip: string;
}

export interface UserData {
  uid: string;
  email: string;
  role: UserRole;
  createdAt: number;
  displayName?: string; // First Name
  lastName?: string;
  phoneNumber?: string;
  companyName?: string;
  usersPerDeveloper?: number;
  photoURL?: string;
  status?: "active" | "disabled";
  developerStats?: DeveloperStats;
  lastLoginAt?: number;
  lastLoginIp?: string;
}
