package com.codegym.schoolsocial.service;

import com.codegym.schoolsocial.entity.Account;
import com.codegym.schoolsocial.entity.Status;
import com.codegym.schoolsocial.repository.AccountRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MyUserDetailsService implements UserDetailsService {

    private final AccountRepository repo;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        Account acc = repo.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        boolean enabled = acc.getStatus() == Status.ACTIVE;
        boolean accountNonLocked = acc.getStatus() != Status.LOCKED;

        return User.builder()
                .username(acc.getUsername())
                .password(acc.getPassword())
                .roles(acc.getRole().name())
                .disabled(!enabled)
                .accountLocked(!accountNonLocked)
                .build();
    }
}
