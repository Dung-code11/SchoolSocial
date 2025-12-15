package com.codegym.schoolsocial.service;

import com.codegym.schoolsocial.dto.LikeHistoryResponse;
import com.codegym.schoolsocial.entity.PostLike;
import com.codegym.schoolsocial.repository.PostLikeRepository;
import com.codegym.schoolsocial.service.InteractionService;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class InteractionServiceImpl implements InteractionService {

    private final PostLikeRepository postLikeRepository;

    @Override
    public Page<LikeHistoryResponse> getLikeHistory(Pageable pageable, Long userId, Long postId) {
        Specification<PostLike> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            // Join với account và post để có thể query
            root.fetch("account");
            root.fetch("post");

            if (userId != null) {
                predicates.add(cb.equal(root.get("account").get("id"), userId));
            }

            if (postId != null) {
                predicates.add(cb.equal(root.get("post").get("id"), postId));
            }

            // Sắp xếp theo thời gian mới nhất
            query.orderBy(cb.desc(root.get("createdAt")));

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        Page<PostLike> likes = postLikeRepository.findAll(spec, pageable);

        return likes.map(this::convertToLikeHistoryResponse);
    }

    private LikeHistoryResponse convertToLikeHistoryResponse(PostLike like) {
        return LikeHistoryResponse.builder()
                .id(like.getId())
                .userId(like.getAccount().getId())
                .username(like.getAccount().getUsername())
                .userFullName(like.getAccount().getPersonalInfo() != null
                        ? like.getAccount().getPersonalInfo().getFullName()
                        : like.getAccount().getUsername())
                .postId(like.getPost().getId())
                .postContent(like.getPost().getContent())
                .timestamp(like.getCreatedAt())
                .build();
    }
}