package com.codegym.schoolsocial.repository;

import com.codegym.schoolsocial.entity.Post;
import com.codegym.schoolsocial.entity.Account;
import com.codegym.schoolsocial.entity.SchoolClass;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PostRepository extends JpaRepository<Post, Long> {

    // Newsfeed: lấy bài không ẩn, mới nhất trước
    List<Post> findByHiddenFalseOrderByCreatedAtDesc();

    // Bài của 1 user
    List<Post> findByAuthorOrderByCreatedAtDesc(Account author);

    // Newsfeed: bài không ẩn của 1 lớp
    List<Post> findByHiddenFalseAndSchoolClassOrderByCreatedAtDesc(SchoolClass schoolClass);
}