package com.codegym.schoolsocial.service;

import com.codegym.schoolsocial.dto.DashboardResponse;
import com.codegym.schoolsocial.entity.Account;
import com.codegym.schoolsocial.entity.Role;
import com.codegym.schoolsocial.repository.AccountRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    private final AccountRepository accountRepository;
    private final NotificationService notificationService;
    private final PostService postService;

    private Account getCurrentAccount() {
        String username = SecurityContextHolder.getContext()
                .getAuthentication().getName();
        return accountRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Account not found"));
    }

    @Override
    public DashboardResponse getDashboardForCurrentUser() {
        Account me = getCurrentAccount();
        Role role = me.getRole();

        switch (role) {
            case STUDENT -> {
                // Học sinh: thông báo + bài viết lớp
                return DashboardResponse.builder()
                        .role("STUDENT")
                        .notifications(notificationService.getNotificationsForCurrentUserClass())
                        .posts(postService.getClassFeed())
                        .build();
            }
            case TEACHER -> {
                // Giáo viên: thông báo do mình tạo + bài viết lớp
                return DashboardResponse.builder()
                        .role("TEACHER")
                        .notifications(notificationService.getNotificationsCreatedByCurrentTeacher())
                        .posts(postService.getClassFeed())
                        .build();
            }
            case ADMIN -> {
                // Admin: tạm thời dùng newsfeed chung + không lọc notify
                return DashboardResponse.builder()
                        .role("ADMIN")
                        .notifications(notificationService.getNotificationsForCurrentUserClass())
                        .posts(postService.getNewsfeed())
                        .build();
            }
            default -> {
                return DashboardResponse.builder()
                        .role(role.name())
                        .notifications(notificationService.getNotificationsForCurrentUserClass())
                        .posts(postService.getClassFeed())
                        .build();
            }
        }
    }
}