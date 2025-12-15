package com.codegym.schoolsocial.repository;

import com.codegym.schoolsocial.entity.Post;
import com.codegym.schoolsocial.entity.Account;
import com.codegym.schoolsocial.entity.SchoolClass;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PostRepository extends JpaRepository<Post, Long> {

    // Newsfeed: lấy bài không ẩn, mới nhất trước
    List<Post> findByHiddenFalseOrderByCreatedAtDesc();

    // Bài của 1 user
    List<Post> findByAuthorOrderByCreatedAtDesc(Account author);

    // Newsfeed: bài không ẩn của 1 lớp
    List<Post> findByHiddenFalseAndSchoolClassOrderByCreatedAtDesc(SchoolClass schoolClass);

    // Tìm kiếm theo nội dung (phân trang)
    Page<Post> findByContentContainingIgnoreCase(String content, Pageable pageable);

    // Tìm kiếm theo tác giả (phân trang)
    Page<Post> findByAuthor(Account author, Pageable pageable);

    // Tìm kiếm theo nội dung và tác giả (phân trang)
    Page<Post> findByContentContainingIgnoreCaseAndAuthor(String content, Account author, Pageable pageable);

    // Tìm kiếm tổng hợp (tùy chọn search và author)
    @Query("SELECT p FROM Post p WHERE " +
            "(:search IS NULL OR LOWER(p.content) LIKE LOWER(CONCAT('%', :search, '%'))) AND " +
            "(:authorId IS NULL OR p.author.id = :authorId)")
    Page<Post> findAllWithFilters(
            @Param("search") String search,
            @Param("authorId") Long authorId,
            Pageable pageable);
}