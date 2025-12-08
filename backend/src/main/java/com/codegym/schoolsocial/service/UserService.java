package com.codegym.schoolsocial.service;

import com.codegym.schoolsocial.dto.UserDTO;
import com.codegym.schoolsocial.entity.*;
import com.codegym.schoolsocial.repository.AccountRepository;
import com.codegym.schoolsocial.repository.SchoolClassRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.data.domain.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {
    private final SchoolClassRepository schoolClassRepository; // thêm
    private final AccountRepository accountRepository;
    private final PasswordEncoder passwordEncoder;

    // GET LIST + SEARCH + FILTER + PAGINATION
    public Page<UserDTO> getUsers(String keyword, String role, String status, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());

        Page<Account> accounts;

        // filter theo role
        if (role != null && !role.isEmpty()) {
            accounts = accountRepository.findByRole(Role.valueOf(role), pageable);
        }
        // filter theo status
        else if (status != null && !status.isEmpty()) {
            accounts = accountRepository.findByStatus(Status.valueOf(status), pageable);
        }
        // search username
        else if (keyword != null && !keyword.isEmpty()) {
            accounts = accountRepository.findByUsernameContainingIgnoreCase(keyword, pageable);
        } else {
            accounts = accountRepository.findAll(pageable);
        }

        return accounts.map(this::convertToDTO);
    }

    // GET by ID
    public UserDTO getUser(Long id) {
        Account account = accountRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return convertToDTO(account);
    }

    // CREATE - THÊM MÃ HÓA PASSWORD
    @Transactional
    public UserDTO createUser(UserDTO dto) {
        // Kiểm tra username đã tồn tại chưa
        if (accountRepository.existsByUsername(dto.getUsername())) {
            throw new RuntimeException("Username already exists");
        }

        PersonalInfo info = new PersonalInfo();
        info.setFullName(dto.getFullName());
        info.setEmail(dto.getEmail());
        info.setPhone(dto.getPhone());
        info.setDob(dto.getDob() != null ? java.time.LocalDate.parse(dto.getDob()) : null);
        info.setAddress(dto.getAddress());

        Account acc = new Account();
        acc.setUsername(dto.getUsername());

        // MÃ HÓA PASSWORD TRƯỚC KHI LƯU
        String encodedPassword = passwordEncoder.encode(dto.getPassword());
        acc.setPassword(encodedPassword);

        acc.setRole(dto.getRole());
        acc.setStatus(dto.getStatus() != null ? dto.getStatus() : Status.ACTIVE);
        acc.setPersonalInfo(info);

        // GÁN CLASS SAU KHI ĐÃ CÓ acc
        if (dto.getClassId() != null) {
            SchoolClass clazz = schoolClassRepository.findById(dto.getClassId())
                    .orElseThrow(() -> new RuntimeException("Class not found"));
            acc.setSchoolClass(clazz);
        }

        accountRepository.save(acc);
        return convertToDTO(acc);
    }

    // UPDATE - THÊM XỬ LÝ PASSWORD
    @Transactional
    public UserDTO updateUser(Long id, UserDTO dto) {
        Account acc = accountRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Cập nhật role và status
        if (dto.getRole() != null) {
            acc.setRole(dto.getRole());
        }

        if (dto.getStatus() != null) {
            acc.setStatus(dto.getStatus());
        }

        // Cập nhật thông tin cá nhân
        if (acc.getPersonalInfo() != null) {
            if (dto.getFullName() != null) {
                acc.getPersonalInfo().setFullName(dto.getFullName());
            }
            if (dto.getPhone() != null) {
                acc.getPersonalInfo().setPhone(dto.getPhone());
            }
            if (dto.getEmail() != null) {
                acc.getPersonalInfo().setEmail(dto.getEmail());
            }
            if (dto.getAddress() != null) {
                acc.getPersonalInfo().setAddress(dto.getAddress());
            }
            if (dto.getDob() != null) {
                acc.getPersonalInfo().setDob(java.time.LocalDate.parse(dto.getDob()));
            }
        }

        // NẾU CÓ PASSWORD MỚI, MÃ HÓA VÀ CẬP NHẬT
        if (dto.getPassword() != null && !dto.getPassword().trim().isEmpty()) {
            String encodedPassword = passwordEncoder.encode(dto.getPassword());
            acc.setPassword(encodedPassword);
        }

        // CẬP NHẬT CLASS
        if (dto.getClassId() != null) {
            SchoolClass clazz = schoolClassRepository.findById(dto.getClassId())
                    .orElseThrow(() -> new RuntimeException("Class not found"));
            acc.setSchoolClass(clazz);
        }

        accountRepository.save(acc);
        return convertToDTO(acc);
    }


    // DELETE
    public void deleteUser(Long id) {
        accountRepository.deleteById(id);
    }

    // CHANGE STATUS
    public void changeStatus(Long id, Status status) {
        Account acc = accountRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        acc.setStatus(status);
        accountRepository.save(acc);
    }

    // Convert to DTO
    private UserDTO convertToDTO(Account acc) {
        UserDTO dto = new UserDTO();
        dto.setId(acc.getId());
        dto.setUsername(acc.getUsername());
        dto.setRole(acc.getRole());
        dto.setStatus(acc.getStatus());

        if (acc.getPersonalInfo() != null) {
            dto.setFullName(acc.getPersonalInfo().getFullName());
            dto.setEmail(acc.getPersonalInfo().getEmail());
            dto.setPhone(acc.getPersonalInfo().getPhone());
            dto.setAddress(acc.getPersonalInfo().getAddress());
            dto.setDob(acc.getPersonalInfo().getDob() != null ? acc.getPersonalInfo().getDob().toString() : null);
        }
        if (acc.getSchoolClass() != null) {
            dto.setClassId(acc.getSchoolClass().getId());
            dto.setClassName(acc.getSchoolClass().getName());
        }

        return dto;
    }
}
