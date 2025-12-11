package com.codegym.schoolsocial.controller;

import com.codegym.schoolsocial.entity.Account;
import com.codegym.schoolsocial.entity.ClassRoom;
import com.codegym.schoolsocial.service.ClassRoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/classes")
@RequiredArgsConstructor
public class ClassRoomController {

    private final ClassRoomService service;

    @PostMapping
    public ClassRoom create(@RequestBody ClassRoom dto) {
        return service.create(dto.getName(), dto.getDescription());
    }

    @GetMapping
    public List<ClassRoom> getAll() {
        return service.getAll();
    }

    @PutMapping("/{id}")
    public ClassRoom update(@PathVariable Long id, @RequestBody ClassRoom dto) {
        return service.update(id, dto.getName(), dto.getDescription());
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }

    @GetMapping("/{id}/users")
    public List<Account> getUsers(@PathVariable Long id) {
        return service.getUsers(id);
    }

    // Assign a user to a class
    @PutMapping("/{classId}/assign/{userId}")
    public void assignUser(@PathVariable Long classId, @PathVariable Long userId) {
        service.assignUser(userId, classId);
    }
}
