package com.codegym.schoolsocial.service;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.function.Function;

@Service
public class JwtService {

    private static final String SECRET = "SUPER_SECRET_KEY_123456";
    private static final long EXPIRATION = 1000 * 60 * 60 * 24;

    private Algorithm algorithm() {
        return Algorithm.HMAC256(SECRET.getBytes());
    }

    public String generateToken(String username, String role) {
        return JWT.create()
                .withSubject(username)
                .withClaim("role", role)
                .withIssuedAt(new Date())
                .withExpiresAt(new Date(System.currentTimeMillis() + EXPIRATION))
                .sign(algorithm());
    }

    public String getUsername(String token) {
        return JWT.require(algorithm()).build().verify(token).getSubject();
    }

    public String getRole(String token) {
        return JWT.require(algorithm()).build().verify(token).getClaim("role").asString();
    }

    public boolean isExpired(String token) {
        return JWT.require(algorithm()).build().verify(token).getExpiresAt().before(new Date());
    }

    public boolean validate(String token, String username) {
        return username.equals(getUsername(token)) && !isExpired(token);
    }
}
