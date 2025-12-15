package com.codegym.schoolsocial.service;

import com.codegym.schoolsocial.dto.LikeHistoryResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface InteractionService {

    Page<LikeHistoryResponse> getLikeHistory(Pageable pageable, Long userId, Long postId);
}