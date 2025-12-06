package com.codegym.schoolsocial.repository;

import com.codegym.schoolsocial.entity.Account;
import com.codegym.schoolsocial.entity.Role;
import com.codegym.schoolsocial.entity.Status;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AccountRepository extends JpaRepository<Account, Long> {
    Optional<Account> findByUsername(String username);

    Page<Account> findByUsernameContainingIgnoreCase(String username, Pageable pageable);

    Page<Account> findByRole(Role role, Pageable pageable);

    Page<Account> findByStatus(Status status, Pageable pageable);
    boolean existsByUsername(String username);
}