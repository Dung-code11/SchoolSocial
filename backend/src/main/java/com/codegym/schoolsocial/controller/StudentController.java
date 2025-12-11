package com.codegym.schoolsocial.controller;

import com.codegym.schoolsocial.service.AnnouncementService;
import com.codegym.schoolsocial.service.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/student")
@RequiredArgsConstructor
public class StudentController {

    private final PostService postService;
    private final AnnouncementService announcementService;

    @GetMapping("/feed/{classId}")
    public Map<String, Object> getFeed(@PathVariable Long classId) {

        Map<String, Object> data = new HashMap<>();
        data.put("posts", postService.getPostByClass(classId));
        data.put("announcements", announcementService.getAnnouncements(classId));

        return data;
    }
}
