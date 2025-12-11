package com.codegym.schoolsocial.service;

import com.codegym.schoolsocial.entity.Account;
import com.codegym.schoolsocial.entity.ClassRoom;
import com.codegym.schoolsocial.repository.AccountRepository;
import com.codegym.schoolsocial.repository.ClassRoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ClassRoomService {

    private final ClassRoomRepository classRepo;
    private final AccountRepository accountRepo;

    // CREATE
    public ClassRoom create(String name, String description) {
        ClassRoom c = new ClassRoom();
        c.setName(name);
        c.setDescription(description);
        return classRepo.save(c);
    }

    // LIST
    public List<ClassRoom> getAll() {
        return classRepo.findAll();
    }

    // UPDATE
    public ClassRoom update(Long id, String name, String description) {
        ClassRoom c = classRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Class not found"));

        c.setName(name);
        c.setDescription(description);
        return classRepo.save(c);
    }

    // DELETE
    public void delete(Long id) {
        classRepo.deleteById(id);
    }

    // GET USERS IN CLASS
    public List<Account> getUsers(Long classId) {
        return accountRepo.findByClassRoom_Id(classId);
    }

    // ASSIGN USER TO CLASS
    public void assignUser(Long userId, Long classId) {
        Account acc = accountRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        ClassRoom room = classRepo.findById(classId)
                .orElseThrow(() -> new RuntimeException("Class not found"));

        acc.setClassRoom(room);
        accountRepo.save(acc);
    }
}
