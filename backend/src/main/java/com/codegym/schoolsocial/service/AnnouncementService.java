package com.codegym.schoolsocial.service;

import com.codegym.schoolsocial.entity.Account;
import com.codegym.schoolsocial.entity.Announcement;
import com.codegym.schoolsocial.entity.ClassRoom;
import com.codegym.schoolsocial.repository.AccountRepository;
import com.codegym.schoolsocial.repository.AnnouncementRepository;
import com.codegym.schoolsocial.repository.ClassRoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AnnouncementService {

    private final AnnouncementRepository announcementRepository;
    private final AccountRepository accountRepository;
    private final ClassRoomRepository classRoomRepository;

    public Announcement createAnnouncement(Long teacherId, Long classId, String message) {

        Account teacher = accountRepository.findById(teacherId)
                .orElseThrow(() -> new RuntimeException("Teacher not found"));

        ClassRoom room = classRoomRepository.findById(classId)
                .orElseThrow(() -> new RuntimeException("Class not found"));

        Announcement announcement = new Announcement();
        announcement.setTeacher(teacher);
        announcement.setClassRoom(room);
        announcement.setMessage(message);

        return announcementRepository.save(announcement);
    }

    public List<Announcement> getAnnouncements(Long classId) {
        return announcementRepository.findByClassRoomIdOrderByCreatedAtDesc(classId);
    }
}
