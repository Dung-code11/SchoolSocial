package com.codegym.schoolsocial.controller;

import com.codegym.schoolsocial.entity.SchoolClass;
import com.codegym.schoolsocial.repository.SchoolClassRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/classes")
@RequiredArgsConstructor
public class ClassController {

    private final SchoolClassRepository classRepository;

    @GetMapping
    public List<SchoolClass> getAll() {
        return classRepository.findAll();
    }

    @GetMapping("/{id}")
    public SchoolClass getById(@PathVariable Long id) {
        return classRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Class not found"));
    }

    @PostMapping
    public SchoolClass create(@RequestBody SchoolClass clazz) {
        return classRepository.save(clazz);
    }

    @PutMapping("/{id}")
    public SchoolClass update(@PathVariable Long id, @RequestBody SchoolClass clazz) {
        SchoolClass existing = classRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Class not found"));

        if (clazz.getName() != null) existing.setName(clazz.getName());
        if (clazz.getDescription() != null) existing.setDescription(clazz.getDescription());

        return classRepository.save(existing);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        classRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}