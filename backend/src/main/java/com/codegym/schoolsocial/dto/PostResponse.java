package com.codegym.schoolsocial.dto;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class PostResponse {
    private Long id;
    private String content;
    private String authorUsername;
    private String authorFullName;
    private LocalDateTime createdAt;
    private boolean hidden;
    private long likeCount;
    private boolean likedByCurrentUser;
}