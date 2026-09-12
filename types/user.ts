export type UserRole = "superAdmin" | "admin" | "developer" | "employee" | "user";

export type PermissionModule = "cities" | "projects" | "units" | "offers" | "customers";
export type PermissionAction = "create" | "read" | "edit" | "delete";

export type ModulePermission = Record<PermissionAction, boolean>;
export type AdminPermissions = Record<PermissionModule, ModulePermission>;

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
  developerUid?: string;
  photoURL?: string;
  status?: "active" | "disabled";
  developerStats?: DeveloperStats;
  lastLoginAt?: number;
  lastLoginIp?: string;
  permissions?: AdminPermissions;
}
