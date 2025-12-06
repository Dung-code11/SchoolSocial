package com.codegym.schoolsocial.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "personal_info")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PersonalInfo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "full_name", nullable = false)
    private String fullName;

    private String email;
    private String phone;
    private LocalDate dob;

    @Column(length = 400)
    private String address;
}
