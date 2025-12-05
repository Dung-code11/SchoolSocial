export type UserRole = "Admin" | "Teacher" | "Student";
export type UserStatus = "ACTIVE" | "INACTIVE";

export interface User {
  id: number;
  fullName: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  phone?: string;
  address?: string;
}

export interface CreateUserDTO {
  fullName: string;
  email: string;
  password: string;
  role: UserRole;
  status: UserStatus;
  phone?: string;
  address?: string;
}

export interface UpdateUserDTO {
  fullName?: string;
  email?: string;
  role?: UserRole;
  status?: UserStatus;
  phone?: string;
  address?: string;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}