package com.codegym.schoolsocial.service;

import com.codegym.schoolsocial.entity.Account;
import com.codegym.schoolsocial.entity.PersonalInfo;
import com.codegym.schoolsocial.entity.Role;
import com.codegym.schoolsocial.entity.Status;
import com.codegym.schoolsocial.repository.AccountRepository;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserExcelService {

    private final AccountRepository accountRepo;
    private final BCryptPasswordEncoder passwordEncoder; // thêm encoder

    public ByteArrayInputStream exportExcel() throws Exception {

        List<Account> accounts = accountRepo.findAll();

        Workbook wb = new XSSFWorkbook();
        Sheet sheet = wb.createSheet("Users");

        // Header
        Row header = sheet.createRow(0);
        String[] titles = {"ID", "Username", "Role", "Status", "Full Name", "Email", "Phone", "Address"};
        for (int i = 0; i < titles.length; i++) {
            header.createCell(i).setCellValue(titles[i]);
        }

        int idx = 1;
        for (Account acc : accounts) {
            Row row = sheet.createRow(idx++);
            row.createCell(0).setCellValue(acc.getId());
            row.createCell(1).setCellValue(acc.getUsername());
            row.createCell(2).setCellValue(acc.getRole().name());
            row.createCell(3).setCellValue(acc.getStatus().name());

            if (acc.getPersonalInfo() != null) {
                row.createCell(4).setCellValue(acc.getPersonalInfo().getFullName());
                row.createCell(5).setCellValue(acc.getPersonalInfo().getEmail());
                row.createCell(6).setCellValue(acc.getPersonalInfo().getPhone());
                row.createCell(7).setCellValue(acc.getPersonalInfo().getAddress());
            }
        }

        ByteArrayOutputStream out = new ByteArrayOutputStream();
        wb.write(out);
        wb.close();

        return new ByteArrayInputStream(out.toByteArray());
    }

    public void importExcel(MultipartFile file) throws Exception {

        Workbook wb = new XSSFWorkbook(file.getInputStream());
        Sheet sheet = wb.getSheetAt(0);

        for (int i = 1; i <= sheet.getLastRowNum(); i++) {

            Row row = sheet.getRow(i);
            if (row == null) continue;

            String username = row.getCell(1).getStringCellValue();
            String role = row.getCell(2).getStringCellValue();
            String status = row.getCell(3).getStringCellValue();

            String fullName = row.getCell(4).getStringCellValue();
            String email = row.getCell(5).getStringCellValue();
            String phone = row.getCell(6).getStringCellValue();
            String address = row.getCell(7).getStringCellValue();

            PersonalInfo info = new PersonalInfo();
            info.setFullName(fullName);
            info.setEmail(email);
            info.setPhone(phone);
            info.setAddress(address);

            Account acc = new Account();
            acc.setUsername(username);

            // MÃ HÓA PASSWORD DEFAULT (VD: "123456")
            acc.setPassword(passwordEncoder.encode("123456"));

            acc.setRole(Role.valueOf(role));
            acc.setStatus(Status.valueOf(status));
            acc.setPersonalInfo(info);

            accountRepo.save(acc);
        }

        wb.close();
    }

}