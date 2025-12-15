// src/types/post.type.ts
export interface Post {
  id: number;
  content: string;
  authorUsername: string;
  authorFullName: string;
  createdAt: string;
  updatedAt?: string;
  hidden: boolean;  // Đổi từ isHidden thành hidden
  likeCount: number;
  likedByCurrentUser: boolean;
  classId?: number;  // Thay vì schoolClass
}

export interface PostCreateRequest {
  content: string;
}

export interface PostResponse {
  content: Post[];
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
}

// Điều chỉnh Interaction type theo schema thực tế
export interface Interaction {
  id: number;
  type: "LIKE";  // Chỉ có LIKE từ bảng post_likes
  postId: number;
  postContent: string;
  userId: number;
  username: string;
  userFullName: string;
  timestamp: string;  // created_at
}

// Comment sẽ lưu ở bảng khác nếu có
export interface Comment {
  id: number;
  postId: number;
  userId: number;
  username: string;
  userFullName: string;
  content: string;
  createdAt: string;
}