export type UserRole = "user" | "admin";

export interface User {
  id: number;
  username: string;
  displayName: string;
  email: string;
  password: string;
  role: UserRole;
}
