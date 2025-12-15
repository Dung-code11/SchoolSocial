package com.codegym.schoolsocial.dto;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class NotificationDTO {
    private Long id;
    private String title;
    private String content;
    private LocalDateTime createdAt;
    private String creatorUsername;
    private String creatorFullName;
    private String className;
}