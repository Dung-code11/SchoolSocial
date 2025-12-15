package com.codegym.schoolsocial.service;

import com.codegym.schoolsocial.dto.LoginRequest;
import com.codegym.schoolsocial.dto.LoginResponse;
import com.codegym.schoolsocial.entity.Account;
import com.codegym.schoolsocial.repository.AccountRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final AccountRepository repo;
    private final JwtService jwtService;
    private final BCryptPasswordEncoder encoder;

    public LoginResponse login(LoginRequest req) {
        Account acc = repo.findByUsername(req.getUsername())
                .orElseThrow(() -> new RuntimeException("Sai tài khoản hoặc mật khẩu"));

        if (!encoder.matches(req.getPassword(), acc.getPassword())) {
            log.warn("Login FAILED for username={}", req.getUsername());
            throw new RuntimeException("Sai tài khoản hoặc mật khẩu");
        }

        String token = jwtService.generateToken(acc.getUsername(), acc.getRole().name());
        log.info("Login SUCCESS for username={} role={}", acc.getUsername(), acc.getRole());

        return new LoginResponse(token, acc.getRole().name());
    }
}