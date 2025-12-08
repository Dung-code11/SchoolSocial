package com.codegym.schoolsocial.repository;

import com.codegym.schoolsocial.entity.PostLike;
import com.codegym.schoolsocial.entity.Post;
import com.codegym.schoolsocial.entity.Account;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.List;

public interface PostLikeRepository extends JpaRepository<PostLike, Long> {

    Optional<PostLike> findByPostAndAccount(Post post, Account account);

    long countByPost(Post post);

    List<PostLike> findByPost(Post post);
}