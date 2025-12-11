package com.codegym.schoolsocial.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "classes")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class ClassRoom {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name; // Ví dụ: 1A, 2B1

    private String description;

    @OneToMany(mappedBy = "classRoom")
    private List<Account> accounts;
}
