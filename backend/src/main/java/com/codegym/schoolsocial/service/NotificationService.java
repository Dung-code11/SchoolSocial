package com.codegym.schoolsocial.service;

import com.codegym.schoolsocial.dto.NotificationDTO;

import java.util.List;

public interface NotificationService {

    NotificationDTO createNotification(String title, String content);

    List<NotificationDTO> getNotificationsForCurrentUserClass();

    List<NotificationDTO> getNotificationsCreatedByCurrentTeacher();
}