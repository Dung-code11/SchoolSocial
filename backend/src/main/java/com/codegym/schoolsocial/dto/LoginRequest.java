package com.codegym.schoolsocial.dto;

import lombok.Data;

@Data
public class LoginRequest {
    private String username;
    private String password;
}