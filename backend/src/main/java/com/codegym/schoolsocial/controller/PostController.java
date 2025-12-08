package com.codegym.schoolsocial.controller;

import com.codegym.schoolsocial.dto.PostCreateRequest;
import com.codegym.schoolsocial.dto.PostResponse;
import com.codegym.schoolsocial.service.PostService;
import lombok.RequiredArgsConstructor;
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
    @PatchMapping("/{postId}/hide")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> hidePost(@PathVariable Long postId) {
        postService.hideMyPost(postId);
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
}