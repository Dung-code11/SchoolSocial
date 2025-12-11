package com.codegym.schoolsocial.dto;

public record PostRequest(
        Long teacherId,
        Long classId,
        String content
) {}
