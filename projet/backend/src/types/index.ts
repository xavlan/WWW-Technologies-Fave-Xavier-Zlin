export type UserRole = 'ADMIN' | 'SUPERADMIN';

export interface SanitizedUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: Date;
}
