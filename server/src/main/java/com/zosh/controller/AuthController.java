package com.zosh.controller;


import com.zosh.domain.USER_ROLE;
import com.zosh.exception.SellerException;
import com.zosh.exception.UserException;
import com.zosh.model.*;
import com.zosh.repository.VerificationCodeRepository;
import com.zosh.request.ResetPasswordRequest;
import com.zosh.request.SignupRequest;
import com.zosh.service.AuthService;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.zosh.request.LoginRequest;
import com.zosh.response.ApiResponse;
import com.zosh.response.AuthResponse;


import jakarta.validation.Valid;


@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final com.zosh.service.EmailService emailService;

    @org.springframework.web.bind.annotation.GetMapping("/test-email")
    public ResponseEntity<String> testEmail(@RequestParam String email) {
        try {
            emailService.sendVerificationOtpEmail(email, "999888", "Test OTP Subject", "Your Test OTP is:");
            return ResponseEntity.ok("SUCCESS: Email sent to " + email);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("ERROR: " + e.getClass().getName() + " - " + e.getMessage());
        }
    }

    @PostMapping("/sent/login-signup-otp")
    public ResponseEntity<ApiResponse> sentLoginOtp(
            @RequestBody VerificationCode req) throws MessagingException, UserException {

        authService.sentLoginOtp(req.getEmail());

        ApiResponse res = new ApiResponse();
        res.setMessage("otp sent");
        return new ResponseEntity<>(res, HttpStatus.CREATED);
    }

    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> createUserHandler(
            @Valid
            @RequestBody SignupRequest req)
            throws SellerException {


        String token = authService.createUser(req);
        AuthResponse authResponse = new AuthResponse();
        authResponse.setJwt(token);
        authResponse.setMessage("Register Success");
        authResponse.setRole(USER_ROLE.ROLE_CUSTOMER);

        return new ResponseEntity<>(authResponse, HttpStatus.OK);

    }

    @PostMapping("/signin")
    public ResponseEntity<AuthResponse> signin(@RequestBody LoginRequest loginRequest) throws SellerException {

        AuthResponse authResponse = authService.signin(loginRequest);
        return new ResponseEntity<>(authResponse, HttpStatus.OK);
    }




}
