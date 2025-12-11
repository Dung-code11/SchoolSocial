import api from "./api";

export const PostApi = {
    getClassPosts: () => api.get("/student/posts"),
    createPost: (data: { teacherId: number; classId: number; content: string }) =>
        api.post("/teacher/post", data),
    getMyPosts: () => api.get("/teacher/myposts"),
}