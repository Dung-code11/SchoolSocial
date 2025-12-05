// src/services/userService.ts
import api from "./api";
import type {
  User,
  CreateUserDTO,
  UpdateUserDTO,
  PaginatedResponse,
  UserStatus 
} from "../types/user.type";


export const userService = {
  // GET LIST with filters
  getUsers: async (
    keyword?: string,
    role?: UserRole,
    status?: UserStatus,
    page: number = 0,
    size: number = 10
  ): Promise<PaginatedResponse<User>> => {
    const params: Record<string, any> = { page, size };

    if (keyword?.trim()) params.keyword = keyword;
    if (role) params.role = role;
    if (status) params.status = status;

    const res = await api.get("/users", { params });
    return res.data;
  },

  // GET DETAIL
  getUser: async (id: number): Promise<User> => {
    const res = await api.get(`/users/${id}`);
    return res.data;
  },

  // CREATE
  createUser: async (userData: CreateUserDTO): Promise<User> => {
    const res = await api.post("/users", userData);
    return res.data;
  },

  // UPDATE
  updateUser: async (id: number, userData: UpdateUserDTO): Promise<User> => {
    const res = await api.put(`/users/${id}`, userData);
    return res.data;
  },

  // DELETE
  deleteUser: async (id: number): Promise<void> => {
    await api.delete(`/users/${id}`);
  },

  // CHANGE STATUS
  changeStatus: async (id: number, status: UserStatus): Promise<void> => {
    await api.put(`/users/${id}/status`, { status });
  },

  // EXPORT EXCEL
  exportExcel: async (): Promise<void> => {
    const res = await api.get("/users/export", {
      responseType: "blob",
    });

    const blob = new Blob([res.data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    });

    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `users_${new Date().toISOString().split("T")[0]}.xlsx`;
    document.body.appendChild(link);
    link.click();

    link.remove();
    window.URL.revokeObjectURL(url);
  },

  // IMPORT EXCEL
  importExcel: async (file: File): Promise<void> => {
    const formData = new FormData();
    formData.append("file", file);

    await api.post("/users/import", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
};
