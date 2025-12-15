package com.codegym.schoolsocial.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "classes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SchoolClass {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String classid;
    // Ví dụ: "10A1", "11B2"...
    @Column(nullable = false, unique = true)
    private String name;

    @Column(length = 500)
    private String description;
}