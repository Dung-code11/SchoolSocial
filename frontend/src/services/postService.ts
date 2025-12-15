// src/services/postService.ts
import api from "./api";
import type {
  Post,
  PostCreateRequest,
  PostResponse,
  Interaction,
} from "../types/post.type";

const postService = {
  // Tạo bài viết mới
  createPost: async (data: PostCreateRequest): Promise<Post> => {
    const response = await api.post("/posts", data);
    return response.data;
  },

  // Lấy danh sách bài viết (newsfeed)
  getNewsfeed: async (): Promise<Post[]> => {
    const response = await api.get("/posts/feed");
    return response.data;
  },

  // Lấy bài viết của user hiện tại
  getMyPosts: async (): Promise<Post[]> => {
    const response = await api.get("/posts/me");
    return response.data;
  },

  // Lấy bài viết theo lớp
  getClassFeed: async (): Promise<Post[]> => {
    const response = await api.get("/posts/class");
    return response.data;
  },

  // Ẩn/hiện bài viết
   togglePostVisibility: async (postId: number): Promise<void> => {
    await api.patch(`/posts/${postId}/toggle-visibility`);
  },

  // Like/unlike bài viết
  toggleLike: async (postId: number): Promise<Post> => {
    const response = await api.post(`/posts/${postId}/like`);
    return response.data;
  },

  // Xóa bài viết (Admin only)
  deletePost: async (postId: number): Promise<void> => {
    await api.delete(`/posts/${postId}`);
  },

  // Lấy tất cả bài viết (Admin only)
  getAllPosts: async (
    page = 0,
    size = 10,
    search?: string,
    authorId?: number
  ): Promise<PostResponse> => {
    const response = await api.get("/posts/admin/all", {
      params: {
        page,
        size,
        search,
        authorId,
      },
    });
    return response.data;
  },

  // Lấy lịch sử LIKE (chỉ từ bảng post_likes)
  getLikeHistory: async (
    page = 0,
    size = 10,
    userId?: number,
    postId?: number
  ): Promise<{ content: Interaction[], totalPages: number, totalElements: number }> => {
    const response = await api.get("/admin/interactions/likes", {
      params: {
        page,
        size,
        userId,
        postId,
      },
    });
    return response.data;
  },

  // Lấy tất cả like của một bài viết
  getLikesByPost: async (postId: number): Promise<Interaction[]> => {
    const response = await api.get(`/posts/${postId}/likes`);
    return response.data;
  },

  // Kiểm tra user đã like bài viết chưa
  checkUserLike: async (postId: number, userId: number): Promise<boolean> => {
    const response = await api.get(`/posts/${postId}/likes/check`, {
      params: { userId },
    });
    return response.data.liked;
  },
};

export default postService;