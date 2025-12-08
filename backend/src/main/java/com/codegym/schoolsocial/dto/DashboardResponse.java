package com.codegym.schoolsocial.dto;

import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class DashboardResponse {

    private String role;

    private List<NotificationDTO> notifications;

    private List<PostResponse> posts;
}