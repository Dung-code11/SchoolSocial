package com.codegym.schoolsocial.dto;

public record AnnouncementRequest(
        Long teacherId,
        Long classId,
        String message
) {}
