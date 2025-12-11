package com.codegym.schoolsocial.repository;

import com.codegym.schoolsocial.entity.Post;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PostRepository extends JpaRepository<Post, Long> {
    List<Post> findByClassRoomIdOrderByCreatedAtDesc(Long classId);
}
