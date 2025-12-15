package com.codegym.schoolsocial.service;

import com.codegym.schoolsocial.dto.NotificationDTO;
import com.codegym.schoolsocial.entity.*;
import com.codegym.schoolsocial.repository.AccountRepository;
import com.codegym.schoolsocial.repository.NotificationRepository;
import com.codegym.schoolsocial.security.SanitizerUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final AccountRepository accountRepository;

    private Account getCurrentAccount() {
        String username = SecurityContextHolder.getContext()
                .getAuthentication().getName();
        return accountRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Account not found"));
    }

    private NotificationDTO toDto(Notification n) {
        PersonalInfo info = n.getCreator().getPersonalInfo();
        return NotificationDTO.builder()
                .id(n.getId())
                .title(n.getTitle())
                .content(n.getContent())
                .createdAt(n.getCreatedAt())
                .creatorUsername(n.getCreator().getUsername())
                .creatorFullName(info != null ? info.getFullName() : null)
                .className(n.getTargetClass() != null ? n.getTargetClass().getName() : null)
                .build();
    }

    @Override
    public NotificationDTO createNotification(String title, String content) {
        Account teacher = getCurrentAccount();
        if (teacher.getRole() != Role.TEACHER && teacher.getRole() != Role.ADMIN) {
            throw new RuntimeException("Chỉ giáo viên hoặc admin mới được tạo thông báo");
        }

        if (teacher.getSchoolClass() == null) {
            throw new RuntimeException("Tài khoản chưa gán vào lớp");
        }

        Notification n = Notification.builder()
                .title(title)
                .content(SanitizerUtil.sanitize(content))
                .createdAt(LocalDateTime.now())
                .creator(teacher)
                .targetClass(teacher.getSchoolClass())
                .build();

        n = notificationRepository.save(n);
        return toDto(n);
    }

    @Override
    public List<NotificationDTO> getNotificationsForCurrentUserClass() {
        Account me = getCurrentAccount();
        if (me.getSchoolClass() == null) {
            return List.of();
        }
        return notificationRepository.findByTargetClassOrderByCreatedAtDesc(me.getSchoolClass())
                .stream()
                .map(this::toDto)
                .toList();
    }

    @Override
    public List<NotificationDTO> getNotificationsCreatedByCurrentTeacher() {
        Account me = getCurrentAccount();
        return notificationRepository.findByCreatorOrderByCreatedAtDesc(me)
                .stream()
                .map(this::toDto)
                .toList();
    }
}