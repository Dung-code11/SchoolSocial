package com.codegym.schoolsocial.controller;

import com.codegym.schoolsocial.entity.Account;
import com.codegym.schoolsocial.repository.AccountRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/parent")
@RequiredArgsConstructor
public class ParentController {

    private final StudentController studentController;
    private final AccountRepository accountRepository;

    @GetMapping("/feed/{studentId}")
    public Object getChildFeed(@PathVariable Long studentId) {

        Account student = accountRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        Long classId = student.getPersonalInfo().getClassRoom().getId();

        return studentController.getFeed(classId);
    }
}
