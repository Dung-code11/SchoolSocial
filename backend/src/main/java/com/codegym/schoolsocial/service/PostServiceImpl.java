package com.codegym.schoolsocial.service;

import com.codegym.schoolsocial.dto.PostCreateRequest;
import com.codegym.schoolsocial.dto.PostResponse;
import com.codegym.schoolsocial.entity.*;
import com.codegym.schoolsocial.repository.AccountRepository;
import com.codegym.schoolsocial.repository.PostLikeRepository;
import com.codegym.schoolsocial.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class PostServiceImpl implements PostService {

    private final PostRepository postRepository;
    private final PostLikeRepository postLikeRepository;
    private final AccountRepository accountRepository;

    // Lấy user hiện đang đăng nhập
    private Account getCurrentAccount() {
        String username = SecurityContextHolder.getContext()
                .getAuthentication().getName();
        return accountRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Account not found"));
    }

    private PostResponse toDto(Post post, Account currentUser) {
        long likeCount = postLikeRepository.countByPost(post);
        boolean likedByCurrentUser = false;
        if (currentUser != null) {
            likedByCurrentUser = postLikeRepository
                    .findByPostAndAccount(post, currentUser)
                    .isPresent();
        }

        PersonalInfo info = post.getAuthor().getPersonalInfo();

        return PostResponse.builder()
                .id(post.getId())
                .content(post.getContent())
                .authorUsername(post.getAuthor().getUsername())
                .authorFullName(info != null ? info.getFullName() : null)
                .createdAt(post.getCreatedAt())
                .hidden(post.isHidden())
                .likeCount(likeCount)
                .likedByCurrentUser(likedByCurrentUser)
                .build();
    }

    @Override
    public PostResponse createPost(PostCreateRequest request) {
        Account author = getCurrentAccount();

        Post post = Post.builder()
                .author(author)
                .content(request.getContent())
                .createdAt(LocalDateTime.now())
                .hidden(false)
                .schoolClass(author.getSchoolClass()) // gán class của tác giả
                .build();

        post = postRepository.save(post);
        return toDto(post, author);
    }

    @Override
    public List<PostResponse> getNewsfeed() {
        Account current = getCurrentAccount();
        return postRepository.findByHiddenFalseOrderByCreatedAtDesc()
                .stream()
                .map(p -> toDto(p, current))
                .toList();
    }

    @Override
    public List<PostResponse> getClassFeed() {
        Account me = getCurrentAccount();
        SchoolClass clazz = me.getSchoolClass();
        if (clazz == null) {
            // Nếu user chưa thuộc lớp nào -> tạm trả newsfeed chung
            return getNewsfeed();
        }
        return postRepository.findByHiddenFalseAndSchoolClassOrderByCreatedAtDesc(clazz)
                .stream()
                .map(p -> toDto(p, me))
                .toList();
    }

    @Override
    public List<PostResponse> getMyPosts() {
        Account me = getCurrentAccount();
        return postRepository.findByAuthorOrderByCreatedAtDesc(me)
                .stream()
                .map(p -> toDto(p, me))
                .toList();
    }

    @Override
    public void togglePostVisibility(Long postId) {
        Account me = getCurrentAccount();
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        // Kiểm tra quyền: chỉ tác giả hoặc ADMIN
        if (!post.getAuthor().getId().equals(me.getId())
                && me.getRole() != Role.ADMIN) {
            throw new AccessDeniedException("Không có quyền thay đổi trạng thái bài viết này");
        }

        // Toggle trạng thái hidden
        post.setHidden(!post.isHidden());
        post.setUpdatedAt(LocalDateTime.now());
        postRepository.save(post);
    }

    @Override
    public void deletePostAsAdmin(Long postId) {
        Account me = getCurrentAccount();
        if (me.getRole() != Role.ADMIN) {
            throw new AccessDeniedException("Chỉ ADMIN mới được xóa bài");
        }
        postRepository.deleteById(postId);
    }

    @Override
    public PostResponse toggleLike(Long postId) {
        Account me = getCurrentAccount();
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        Optional<PostLike> existing = postLikeRepository.findByPostAndAccount(post, me);

        if (existing.isPresent()) {
            // Đã like rồi -> bỏ like
            postLikeRepository.delete(existing.get());
        } else {
            // Chưa like -> tạo mới
            PostLike like = PostLike.builder()
                    .post(post)
                    .account(me)
                    .createdAt(LocalDateTime.now())
                    .build();
            postLikeRepository.save(like);
        }

        return toDto(post, me);
    }
    @Override
    @Transactional(readOnly = true)
    public Page<PostResponse> getAllPosts(Pageable pageable, String search, Long authorId) {
        Account currentUser = getCurrentAccount();

        // Kiểm tra quyền ADMIN
        if (currentUser.getRole() != Role.ADMIN) {
            throw new AccessDeniedException("Chỉ ADMIN mới được truy cập endpoint này");
        }

        // Sử dụng query tìm kiếm động
        Page<Post> postsPage;

        if (authorId != null && search != null && !search.trim().isEmpty()) {
            // Tìm theo cả author và search
            Account author = accountRepository.findById(authorId)
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy tác giả với ID: " + authorId));
            postsPage = postRepository.findByContentContainingIgnoreCaseAndAuthor(search, author, pageable);
        } else if (authorId != null) {
            // Chỉ tìm theo author
            Account author = accountRepository.findById(authorId)
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy tác giả với ID: " + authorId));
            postsPage = postRepository.findByAuthor(author, pageable);
        } else if (search != null && !search.trim().isEmpty()) {
            // Chỉ tìm theo search
            postsPage = postRepository.findByContentContainingIgnoreCase(search, pageable);
        } else {
            // Lấy tất cả
            postsPage = postRepository.findAll(pageable);
        }

        return postsPage.map(post -> toDto(post, currentUser));
    }
}
