import api from "./api";

export const AnnouncementApi = {
    getAnnouncements: () => api.get("/student/announcements"),
    createAnnouncement: (data: { teacherId: number; classId: number; message: string }) =>
        api.post("/teacher/announcement", data),
};
