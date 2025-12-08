package com.codegym.schoolsocial.controller;

import com.codegym.schoolsocial.dto.NotificationDTO;
import com.codegym.schoolsocial.service.NotificationService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/teacher/notifications")
@RequiredArgsConstructor
public class TeacherNotificationController {

    private final NotificationService notificationService;

    @PostMapping
    public ResponseEntity<NotificationDTO> create(@RequestBody CreateNotificationRequest req) {
        return ResponseEntity.ok(
                notificationService.createNotification(req.getTitle(), req.getContent())
        );
    }

    @GetMapping("/me")
    public ResponseEntity<List<NotificationDTO>> myNotifications() {
        return ResponseEntity.ok(notificationService.getNotificationsCreatedByCurrentTeacher());
    }

    @Data
    public static class CreateNotificationRequest {
        private String title;
        private String content;
    }
}