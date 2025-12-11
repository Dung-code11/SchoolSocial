package com.codegym.schoolsocial.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Announcement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Account teacher;

    @ManyToOne
    private ClassRoom classRoom;

    @Column(nullable = false, length = 1000)
    private String message;

    private LocalDateTime createdAt = LocalDateTime.now();
}
