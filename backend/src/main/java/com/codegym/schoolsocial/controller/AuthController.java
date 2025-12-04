package com.codegym.schoolsocial.controller;

import com.codegym.schoolsocial.dto.LoginRequest;
import com.codegym.schoolsocial.dto.LoginResponse;
import com.codegym.schoolsocial.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest req) {
        return authService.login(req);
    }
}
