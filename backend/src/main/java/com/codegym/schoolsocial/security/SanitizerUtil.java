package com.codegym.schoolsocial.security;

public class SanitizerUtil {

    // Rất đơn giản: escape dấu < và > để tránh chèn HTML/script
    public static String sanitize(String input) {
        if (input == null) return null;
        String result = input.replace("<", "&lt;")
                .replace(">", "&gt;");
        return result;
    }
}