package com.codegym.schoolsocial.service;

import com.codegym.schoolsocial.dto.PostCreateRequest;
import com.codegym.schoolsocial.dto.PostResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;

public interface PostService {

    PostResponse createPost(PostCreateRequest request);

    List<PostResponse> getNewsfeed();

    List<PostResponse> getMyPosts();

    void togglePostVisibility(Long postId);

    void deletePostAsAdmin(Long postId);

    PostResponse toggleLike(Long postId);

    List<PostResponse> getClassFeed();
    Page<PostResponse> getAllPosts(Pageable pageable, String search, Long authorId);
}