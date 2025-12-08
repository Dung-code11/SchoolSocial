package com.codegym.schoolsocial.repository;

import com.codegym.schoolsocial.entity.Notification;
import com.codegym.schoolsocial.entity.Account;
import com.codegym.schoolsocial.entity.SchoolClass;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {

    // Thông báo theo lớp
    List<Notification> findByTargetClassOrderByCreatedAtDesc(SchoolClass targetClass);

    // Thông báo do 1 giáo viên tạo
    List<Notification> findByCreatorOrderByCreatedAtDesc(Account creator);
}