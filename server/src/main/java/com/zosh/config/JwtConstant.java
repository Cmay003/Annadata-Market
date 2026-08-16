package com.zosh.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

/**
 * JWT configuration constants.
 * JWT_SECRET is read from the environment variable JWT_SECRET (via application.properties).
 * Never hardcode the secret here — rotate it via your deployment environment.
 */
@Component
public class JwtConstant {

    public static final String JWT_HEADER = "Authorization";

    /**
     * Shared secret key for signing JWT tokens.
     * Set via environment variable: JWT_SECRET
     * Generate a strong secret: openssl rand -hex 64
     */
    @Value("${jwt.secret}")
    private String jwtSecret;

    // Spring-managed singleton — use JwtConstant bean to get the secret
    private static JwtConstant instance;

    public JwtConstant() {
        instance = this;
    }

    public static String getSecretKey() {
        if (instance == null || instance.jwtSecret == null || instance.jwtSecret.isBlank()) {
            throw new IllegalStateException(
                "JWT_SECRET environment variable is not set! " +
                "Set it before starting the application. " +
                "Generate one with: openssl rand -hex 64"
            );
        }
        return instance.jwtSecret;
    }
}
