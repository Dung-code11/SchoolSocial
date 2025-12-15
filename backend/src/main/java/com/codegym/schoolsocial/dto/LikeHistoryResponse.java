package com.codegym.schoolsocial.dto;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class LikeHistoryResponse {
    private Long id;
    private Long userId;
    private String username;
    private String userFullName;
    private Long postId;
    private String postContent;
    private LocalDateTime timestamp;
}