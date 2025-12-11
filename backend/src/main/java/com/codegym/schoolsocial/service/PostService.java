package com.codegym.schoolsocial.service;

import com.codegym.schoolsocial.entity.Account;
import com.codegym.schoolsocial.entity.ClassRoom;
import com.codegym.schoolsocial.entity.Post;
import com.codegym.schoolsocial.repository.AccountRepository;
import com.codegym.schoolsocial.repository.ClassRoomRepository;
import com.codegym.schoolsocial.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;
    private final AccountRepository accountRepository;
    private final ClassRoomRepository classRoomRepository;

    public Post createPost(Long accountId, Long classId, String content) {
        Account acc = accountRepository.findById(accountId)
                .orElseThrow(() -> new RuntimeException("Account not found"));

        ClassRoom classroom = classRoomRepository.findById(classId)
                .orElseThrow(() -> new RuntimeException("Class not found"));

        Post post = new Post();
        post.setCreatedBy(acc);
        post.setClassRoom(classroom);
        post.setContent(content);

        return postRepository.save(post);
    }

    public List<Post> getPostByClass(Long classId) {
        return postRepository.findByClassRoomIdOrderByCreatedAtDesc(classId);
    }
}
