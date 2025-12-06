package com.codegym.schoolsocial.service;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.function.Function;

@Service
public class JwtService {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration}")
    private long expirationMs;

    private Algorithm algorithm() {
        return Algorithm.HMAC256(secret.getBytes());
    }

    public String generateToken(String username, String role) {
        return JWT.create()
                .withSubject(username)
                .withClaim("role", role)
                .withIssuedAt(new Date())
                .withExpiresAt(new Date(System.currentTimeMillis() + expirationMs))
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
