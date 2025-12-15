package com.codegym.schoolsocial.controller;

import com.codegym.schoolsocial.dto.LikeHistoryResponse;
import com.codegym.schoolsocial.service.InteractionService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/interactions")
@RequiredArgsConstructor
public class InteractionController {

    private final InteractionService interactionService;

    @GetMapping("/admin/likes")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<LikeHistoryResponse>> getLikeHistory(
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable,
            @RequestParam(required = false) Long userId,
            @RequestParam(required = false) Long postId) {

        Page<LikeHistoryResponse> response = interactionService.getLikeHistory(pageable, userId, postId);
        return ResponseEntity.ok(response);
    }
}