// src/services/classService.ts
import api from "./api";

export interface SchoolClass {
  id: number;
  classid: string;
  name: string;
  description: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateClassDTO {
  classid: string;
  name: string;
  description?: string;
}

export interface UpdateClassDTO {
  classid?: string;
  name?: string;
  description?: string;
}

export interface PaginatedClassResponse {
  content: SchoolClass[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}

export const classService = {
  // Lấy danh sách lớp học
  getAllClasses: async (): Promise<SchoolClass[]> => {
    const res = await api.get("/admin/classes");
    return res.data;
  },

  // Lấy danh sách phân trang
  getClasses: async (
    page: number = 0,
    size: number = 10,
    search?: string
  ): Promise<PaginatedClassResponse> => {
    const params: Record<string, any> = { page, size };
    if (search) params.search = search;
    
    const res = await api.get("/admin/classes", { params });
    return res.data;
  },

  // Lấy thông tin một lớp
  getClass: async (id: number): Promise<SchoolClass> => {
    const res = await api.get(`/admin/classes/${id}`);
    return res.data;
  },

  // Tạo lớp mới
  createClass: async (data: CreateClassDTO): Promise<SchoolClass> => {
    const res = await api.post("/admin/classes", data);
    return res.data;
  },

  // Cập nhật lớp
  updateClass: async (id: number, data: UpdateClassDTO): Promise<SchoolClass> => {
    const res = await api.put(`/admin/classes/${id}`, data);
    return res.data;
  },

  // Xóa lớp
  deleteClass: async (id: number): Promise<void> => {
    await api.delete(`/admin/classes/${id}`);
  },

  // Xuất Excel
  exportExcel: async (): Promise<void> => {
    const res = await api.get("/admin/classes/export", {
      responseType: "blob",
    });

    const blob = new Blob([res.data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `classes_${new Date().toISOString().split("T")[0]}.xlsx`;
    document.body.appendChild(link);
    link.click();
    
    link.remove();
    window.URL.revokeObjectURL(url);
  },

  // Nhập Excel
  importExcel: async (file: File): Promise<void> => {
    const formData = new FormData();
    formData.append("file", file);

    await api.post("/admin/classes/import", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
};