export type UserRole = "admin" | "developer" | "user";

export interface UserData {
  uid: string;
  email: string;
  role: UserRole;
  createdAt: number;
  displayName?: string;
  phoneNumber?: string;
  // Specific data for developers can be nested or kept flat
  companyName?: string; 
}
