package com.codegym.schoolsocial.repository;

import com.codegym.schoolsocial.entity.SchoolClass;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SchoolClassRepository extends JpaRepository<SchoolClass, Long> {
    Optional<SchoolClass> findByClassid(String classid);
    Optional<SchoolClass> findByName(String name);
}