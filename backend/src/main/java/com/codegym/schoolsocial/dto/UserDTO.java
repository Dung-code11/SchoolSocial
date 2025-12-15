package com.codegym.schoolsocial.dto;

import com.codegym.schoolsocial.entity.Role;
import com.codegym.schoolsocial.entity.Status;
import lombok.Data;

@Data
public class UserDTO {
    private Long id;
    private String username;
    private String password;
    private Role role;

    private String fullName;
    private String email;
    private String phone;
    private String address;
    private String dob;

    private Status status;

    private String classId;
    private String className;
}
