export type UserRole = "ADMIN" | "TEACHER" | "STUDENT";  // Viết hoa chữ cái đầu
export type UserStatus = "ACTIVE" | "LOCKED";

export interface User {
  id: number;
  username: string;
  fullName: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  phone: string | null;
  address: string | null;
  classId: string | null;
  className: string | null;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateUserDTO {
  username: string;
  fullName: string;
  email: string;
  password: string;
  role: UserRole;
  status: UserStatus;
  phone?: string;
  address?: string;
  classId?: string;
  className?: string;
}

export interface UpdateUserDTO {
  fullName?: string;
  email?: string;
  role?: UserRole;
  status?: UserStatus;
  phone?: string;
  address?: string;
  classId?: string;
  className?: string;
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