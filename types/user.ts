export type UserRole = "admin" | "developer" | "user";

export interface DeveloperStats {
  projectsCount: number;
  unitsCount: number;
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
  status?: "active" | "disabled";
  developerStats?: DeveloperStats;
}
