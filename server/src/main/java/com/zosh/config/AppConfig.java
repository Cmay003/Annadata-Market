package com.zosh.config;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;

import jakarta.servlet.http.HttpServletRequest;

@Configuration
@EnableWebSecurity
public class AppConfig {

    // ✅ FIX B11: Frontend URL properties se aayega — hardcoded nahi
    @Value("${frontend.url:http://localhost:5173}")
    private String frontendUrl;

    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
            .sessionManagement(management ->
                management.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

            // ✅ FIX B1: Security rules ka ORDER fix kiya
            // Spring Security pehli matching rule apply karta hai.
            // SPECIFIC rules PEHLE aane chahiye, BROAD rules baad mein.
            .authorizeHttpRequests(authorize -> authorize

                // ─── Public endpoints (authentication needed nahi) ──────
                .requestMatchers("/auth/**").permitAll()                   // buyer login/signup/otp
                .requestMatchers("/sellers/register").permitAll()          // seller phase-1 signup
                .requestMatchers("/sellers/login").permitAll()             // seller email+password login
                .requestMatchers("/sellers/sent/login-top").permitAll()    // seller OTP send (legacy)
                .requestMatchers("/sellers/verify/login-top").permitAll()  // seller OTP verify (legacy)
                .requestMatchers("/sellers/verify/**").permitAll()         // seller email verify
                .requestMatchers("/sellers").permitAll()                   // seller register POST (legacy)
                .requestMatchers("/sellers/{id}").permitAll()              // seller by id GET
                .requestMatchers("/delivery/signup").permitAll()           // delivery person signup
                .requestMatchers("/delivery/login").permitAll()            // delivery person login
                .requestMatchers("/delivery/reset-password").permitAll()  // delivery password recovery
                .requestMatchers("/api/products/*/reviews").permitAll()    // product reviews public
                .requestMatchers("/api/products/**").permitAll()           // products browse — public
                .requestMatchers("/api/home/**").permitAll()               // home page data
                .requestMatchers("/api/deals/**").permitAll()              // deals — public

                // ─── Role-specific endpoints ─────────────────────────────
                // ✅ FIX B7: /admin/** aur /delivery/** protected hai
                .requestMatchers("/admin/**").hasRole("ADMIN")
                .requestMatchers("/delivery/**").hasRole("DELIVERY")

                // ─── Seller profile/report — authenticated seller ────────
                .requestMatchers("/sellers/profile").authenticated()
                .requestMatchers("/sellers/report").authenticated()

                // ─── Baaki sab /api/** — authenticated users ────────────
                .requestMatchers("/api/**").authenticated()

                // ─── Kuch bhi aur — allow (health checks etc.) ──────────
                .anyRequest().permitAll()
            )

            .addFilterBefore(new JwtTokenValidator(), BasicAuthenticationFilter.class)
            .csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configurationSource(corsConfigurationSource()));

        return http.build();
    }

    // ✅ FIX B11: CORS — frontend URL dynamic hai, localhost bhi support karta hai
    private CorsConfigurationSource corsConfigurationSource() {
        return new CorsConfigurationSource() {
            @Override
            public CorsConfiguration getCorsConfiguration(HttpServletRequest request) {
                CorsConfiguration cfg = new CorsConfiguration();

                // ✅ Production URL + localhost dono allowed
                // Production deploy karte waqt FRONTEND_URL environment variable set karo
                cfg.setAllowedOrigins(Arrays.asList(
                    frontendUrl,             // ENV se: https://annadata-market.com ya localhost
                    "http://localhost:5173", // Vite default
                    "http://127.0.0.1:5173", // Vite alt
                    "http://localhost:3000", // CRA fallback
                    "http://127.0.0.1:3000"
                ));

                cfg.setAllowedMethods(Arrays.asList(
                    "GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"
                ));
                cfg.setAllowCredentials(true);
                cfg.setAllowedHeaders(Collections.singletonList("*"));
                cfg.setExposedHeaders(List.of("Authorization"));
                cfg.setMaxAge(3600L);
                return cfg;
            }
        };
    }

    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}