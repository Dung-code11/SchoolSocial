package com.codegym.schoolsocial.service;

import com.codegym.schoolsocial.dto.PostCreateRequest;
import com.codegym.schoolsocial.dto.PostResponse;

import java.util.List;

public interface PostService {

    PostResponse createPost(PostCreateRequest request);

    List<PostResponse> getNewsfeed();

    List<PostResponse> getMyPosts();

    void hideMyPost(Long postId);

    void deletePostAsAdmin(Long postId);

    PostResponse toggleLike(Long postId);

    List<PostResponse> getClassFeed();
}