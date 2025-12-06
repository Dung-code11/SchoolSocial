package com.codegym.schoolsocial.controller;

import com.codegym.schoolsocial.dto.UserDTO;
import com.codegym.schoolsocial.entity.Status;
import com.codegym.schoolsocial.service.UserExcelService;
import com.codegym.schoolsocial.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final UserExcelService excelService;   // ❗ bạn thiếu dòng này

    // GET LIST
    @GetMapping
    public Page<UserDTO> getUsers(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String role,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return userService.getUsers(keyword, role, status, page, size);
    }

    // GET DETAIL
    @GetMapping("/{id}")
    public UserDTO getUser(@PathVariable Long id) {
        return userService.getUser(id);
    }

    // CREATE
    @PostMapping
    public UserDTO createUser(@RequestBody UserDTO dto) {
        return userService.createUser(dto);
    }

    // UPDATE
    @PutMapping("/{id}")
    public UserDTO updateUser(@PathVariable Long id, @RequestBody UserDTO dto) {
        return userService.updateUser(id, dto);
    }

    // DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    // CHANGE STATUS
    @PutMapping("/{id}/status")
    public void changeStatus(@PathVariable Long id, @RequestParam Status status) {
        userService.changeStatus(id, status);
    }

    // EXPORT EXCEL
    @GetMapping("/export")
    public ResponseEntity<byte[]> exportExcel() throws Exception {
        ByteArrayInputStream in = excelService.exportExcel();

        return ResponseEntity.ok()
                .header("Content-Disposition", "attachment; filename=users.xlsx")
                .body(in.readAllBytes());
    }

    // IMPORT EXCEL
    @PostMapping("/import")
    public ResponseEntity<String> importExcel(@RequestParam("file") MultipartFile file) throws Exception {
        excelService.importExcel(file);
        return ResponseEntity.ok("Upload Excel OK");
    }
}
