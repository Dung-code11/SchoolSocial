package com.codegym.schoolsocial.controller;

import com.codegym.schoolsocial.dto.PostCreateRequest;
import com.codegym.schoolsocial.dto.PostResponse;
import com.codegym.schoolsocial.service.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;

    // Tạo bài viết (text-only)
    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<PostResponse> createPost(@RequestBody PostCreateRequest request) {
        return ResponseEntity.ok(postService.createPost(request));
    }

    // Newsfeed: timeline (mới nhất trước)
    @GetMapping("/feed")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<PostResponse>> getNewsfeed() {
        return ResponseEntity.ok(postService.getNewsfeed());
    }

    // Danh sách bài viết của chính mình
    @GetMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<PostResponse>> getMyPosts() {
        return ResponseEntity.ok(postService.getMyPosts());
    }

    // Ẩn bài viết của mình (hoặc Admin)
    @PatchMapping("/{postId}/toggle-visibility")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> togglePostVisibility(@PathVariable Long postId) {
        postService.togglePostVisibility(postId);
        return ResponseEntity.noContent().build();
    }

    // Like / Unlike bài viết (toggle)
    @PostMapping("/{postId}/like")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<PostResponse> toggleLike(@PathVariable Long postId) {
        return ResponseEntity.ok(postService.toggleLike(postId));
    }

    // Xóa bài viết (CHỈ ADMIN)
    @DeleteMapping("/{postId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deletePost(@PathVariable Long postId) {
        postService.deletePostAsAdmin(postId);
        return ResponseEntity.noContent().build();
    }
    // Lấy tất cả bài viết (ADMIN only)
    @GetMapping("/admin/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<PostResponse>> getAllPosts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Long authorId) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return ResponseEntity.ok(postService.getAllPosts(pageable, search, authorId));
    }
}