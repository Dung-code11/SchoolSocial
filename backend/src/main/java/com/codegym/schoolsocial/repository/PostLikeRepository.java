package com.codegym.schoolsocial.repository;

import com.codegym.schoolsocial.entity.PostLike;
import com.codegym.schoolsocial.entity.Post;
import com.codegym.schoolsocial.entity.Account;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;
import java.util.List;

public interface PostLikeRepository extends JpaRepository<PostLike, Long>, JpaSpecificationExecutor<PostLike> {

    Optional<PostLike> findByPostAndAccount(Post post, Account account);

    long countByPost(Post post);

    List<PostLike> findByPost(Post post);
    boolean existsByPostAndAccount(Post post, Account account);

    // Thêm phương thức để lấy like history với join
    @Query("SELECT pl FROM PostLike pl " +
            "JOIN FETCH pl.account a " +
            "JOIN FETCH pl.post p " +
            "WHERE (:userId IS NULL OR a.id = :userId) " +
            "AND (:postId IS NULL OR p.id = :postId)")
    Page<PostLike> findLikeHistory(
            @Param("userId") Long userId,
            @Param("postId") Long postId,
            Pageable pageable);
}