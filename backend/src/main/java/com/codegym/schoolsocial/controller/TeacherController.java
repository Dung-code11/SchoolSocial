package com.codegym.schoolsocial.controller;

import com.codegym.schoolsocial.dto.AnnouncementRequest;
import com.codegym.schoolsocial.dto.PostRequest;
import com.codegym.schoolsocial.entity.Announcement;
import com.codegym.schoolsocial.entity.Post;
import com.codegym.schoolsocial.service.AnnouncementService;
import com.codegym.schoolsocial.service.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/teacher")
@RequiredArgsConstructor
public class TeacherController {

    private final PostService postService;
    private final AnnouncementService announcementService;

    @PostMapping("/post")
    public Post createPost(@RequestBody PostRequest req) {
        return postService.createPost(req.teacherId(), req.classId(), req.content());
    }

    @PostMapping("/announcement")
    public Announcement createAnnouncement(@RequestBody AnnouncementRequest req) {
        return announcementService.createAnnouncement(req.teacherId(), req.classId(), req.message());
    }
}
