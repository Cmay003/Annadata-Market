// package com.zosh.controller;
// import com.zosh.config.JwtProvider;
// import com.zosh.domain.AccountStatus;
// import com.zosh.domain.USER_ROLE;
// import com.zosh.exception.SellerException;
// import com.zosh.model.Seller;
// import com.zosh.model.SellerReport;
// import com.zosh.model.VerificationCode;
// import com.zosh.repository.VerificationCodeRepository;
// import com.zosh.response.ApiResponse;
// import com.zosh.response.AuthResponse;
// import com.zosh.service.*;
// import com.zosh.service.impl.CustomeUserServiceImplementation;
// import com.zosh.utils.OtpUtils;
// import jakarta.mail.MessagingException;
// import lombok.RequiredArgsConstructor;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.http.HttpStatus;
// import org.springframework.http.ResponseEntity;
// import org.springframework.security.authentication.BadCredentialsException;
// import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
// import org.springframework.security.core.Authentication;
// import org.springframework.security.core.GrantedAuthority;
// import org.springframework.security.core.context.SecurityContextHolder;
// import org.springframework.security.core.userdetails.UserDetails;
// import org.springframework.web.bind.annotation.*;
// import java.util.Collection;
// import java.util.List;
// @RestController
// @RequestMapping("/sellers")
// @RequiredArgsConstructor
// public class SellerController {
//     private final SellerService sellerService;
//     private final SellerReportService sellerReportService;
//     private final EmailService emailService;
//     private final VerificationCodeRepository verificationCodeRepository;
//     private final VerificationService verificationService;
//     private final JwtProvider jwtProvider;
//     private final CustomeUserServiceImplementation customeUserServiceImplementation;
//     @PostMapping("/sent/login-top")
//     public ResponseEntity<ApiResponse> sentLoginOtp(@RequestBody VerificationCode req) throws MessagingException, SellerException {
//         Seller seller = sellerService.getSellerByEmail(req.getEmail());
//         String otp = OtpUtils.generateOTP();
//         VerificationCode verificationCode = verificationService.createVerificationCode(otp, req.getEmail());
//         String subject = "Annadata Market Login Otp";
//         String text = "your login otp is - ";
//         emailService.sendVerificationOtpEmail(req.getEmail(), verificationCode.getOtp(), subject, text);
//         ApiResponse res = new ApiResponse();
//         res.setMessage("otp sent");
//         return new ResponseEntity<>(res, HttpStatus.CREATED);
//     }
//     @PostMapping("/verify/login-top")
//     public ResponseEntity<AuthResponse> verifyLoginOtp(@RequestBody VerificationCode req) throws MessagingException, SellerException {
// //        Seller savedSeller = sellerService.createSeller(seller);
//         String otp = req.getOtp();
//         String email = req.getEmail();
//         VerificationCode verificationCode = verificationCodeRepository.findByEmail(email);
//         if (verificationCode == null || !verificationCode.getOtp().equals(otp)) {
//             throw new SellerException("wrong otp...");
//         }
//         Authentication authentication = authenticate(req.getEmail());
//         SecurityContextHolder.getContext().setAuthentication(authentication);
//         String token = jwtProvider.generateToken(authentication);
//         AuthResponse authResponse = new AuthResponse();
//         authResponse.setMessage("Login Success");
//         authResponse.setJwt(token);
//         Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
//         String roleName = authorities.isEmpty() ? null : authorities.iterator().next().getAuthority();
//         authResponse.setRole(USER_ROLE.valueOf(roleName));
//         return new ResponseEntity<AuthResponse>(authResponse, HttpStatus.OK);
//     }
//     private Authentication authenticate(String username) {
//         UserDetails userDetails = customeUserServiceImplementation.loadUserByUsername("seller_" + username);
//         System.out.println("sign in userDetails - " + userDetails);
//         if (userDetails == null) {
//             System.out.println("sign in userDetails - null " + userDetails);
//             throw new BadCredentialsException("Invalid username or password");
//         }
//         return new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
//     }
//     @PatchMapping("/verify/{otp}")
//     public ResponseEntity<Seller> verifySellerEmail(@PathVariable String otp) throws SellerException {
//         VerificationCode verificationCode = verificationCodeRepository.findByOtp(otp);
//         if (verificationCode == null || !verificationCode.getOtp().equals(otp)) {
//             throw new SellerException("wrong otp...");
//         }
//         Seller seller = sellerService.verifyEmail(verificationCode.getEmail(), otp);
//         return new ResponseEntity<>(seller, HttpStatus.OK);
//     }
//     @PostMapping
//     public ResponseEntity<Seller> createSeller(@RequestBody Seller seller) throws SellerException, MessagingException {
//         Seller savedSeller = sellerService.createSeller(seller);
//         String otp = OtpUtils.generateOTP();
//         VerificationCode verificationCode = verificationService.createVerificationCode(otp, seller.getEmail());
//         String subject = "Annadata Market Email Verification Code";
//         String text = "Welcome to Annadata Market, verify your account using this link ";
//         String frontend_url = "http://localhost:3000/verify-seller/";
//         emailService.sendVerificationOtpEmail(seller.getEmail(), verificationCode.getOtp(), subject, text + frontend_url);
//         return new ResponseEntity<>(savedSeller, HttpStatus.CREATED);
//     }
//     @GetMapping("/{id}")
//     public ResponseEntity<Seller> getSellerById(@PathVariable Long id) throws SellerException {
//         Seller seller = sellerService.getSellerById(id);
//         return new ResponseEntity<>(seller, HttpStatus.OK);
//     }
//     @GetMapping("/profile")
//     public ResponseEntity<Seller> getSellerByJwt(
//             @RequestHeader("Authorization") String jwt) throws SellerException {
//         String email = jwtProvider.getEmailFromJwtToken(jwt);
//         Seller seller = sellerService.getSellerByEmail(email);
//         return new ResponseEntity<>(seller, HttpStatus.OK);
//     }
//     @GetMapping("/report")
//     public ResponseEntity<SellerReport> getSellerReport(
//             @RequestHeader("Authorization") String jwt) throws SellerException {
//         String email = jwtProvider.getEmailFromJwtToken(jwt);
//         Seller seller = sellerService.getSellerByEmail(email);
//         SellerReport report = sellerReportService.getSellerReport(seller);
//         return new ResponseEntity<>(report, HttpStatus.OK);
//     }
//     @GetMapping
//     public ResponseEntity<List<Seller>> getAllSellers(
//             @RequestParam(required = false) AccountStatus status) {
//         List<Seller> sellers = sellerService.getAllSellers(status);
//         return ResponseEntity.ok(sellers);
//     }
//     @PatchMapping()
//     public ResponseEntity<Seller> updateSeller(
//             @RequestHeader("Authorization") String jwt, @RequestBody Seller seller) throws SellerException {
//         Seller profile = sellerService.getSellerProfile(jwt);
//         Seller updatedSeller = sellerService.updateSeller(profile.getId(), seller);
//         return ResponseEntity.ok(updatedSeller);
//     }
//     @DeleteMapping("/{id}")
//     public ResponseEntity<Void> deleteSeller(@PathVariable Long id) throws SellerException {
//         sellerService.deleteSeller(id);
//         return ResponseEntity.noContent().build();
//     }
// }
package com.zosh.controller;

import java.util.Collection;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.zosh.config.JwtProvider;
import com.zosh.domain.AccountStatus;
import com.zosh.domain.USER_ROLE;
import com.zosh.exception.SellerException;
import com.zosh.model.Address;
import com.zosh.model.BankDetails;
import com.zosh.model.BusinessDetails;
import com.zosh.model.CommissionSetting;
import com.zosh.model.Order;
import com.zosh.model.Seller;
import com.zosh.model.SellerReport;
import com.zosh.model.VerificationCode;
import com.zosh.repository.CommissionSettingRepository;
import com.zosh.repository.OrderRepository;
import com.zosh.repository.SellerRepository;
import com.zosh.repository.VerificationCodeRepository;
import com.zosh.request.LoginRequest;
import com.zosh.request.SellerOnboardingRequest;
import com.zosh.request.SellerRegisterRequest;
import com.zosh.response.ApiResponse;
import com.zosh.response.AuthResponse;
import com.zosh.response.CommissionSummaryResponse;
import com.zosh.service.EmailService;
import com.zosh.service.SellerReportService;
import com.zosh.service.SellerService;
import com.zosh.service.VerificationService;
import com.zosh.service.impl.CustomeUserServiceImplementation;
import com.zosh.utils.OtpUtils;
import jakarta.validation.Valid;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import lombok.extern.slf4j.Slf4j;

// ✅ FIX B7: /sellers URL structure rakha — AppConfig mein public rules add kiye
//            Public endpoints: POST /sellers, GET /sellers/{id}, login OTP endpoints
//            Protected endpoints: GET /sellers/profile, GET /sellers/report (authenticated)
// ✅ FIX B13: @Autowired HATAYA — sirf @RequiredArgsConstructor (constructor injection) use ho
@Slf4j
@RestController
@RequestMapping("/sellers")
@RequiredArgsConstructor // ✅ @Autowired nahi — consistent constructor injection
public class SellerController {

    private final SellerService sellerService;
    private final SellerReportService sellerReportService;
    private final EmailService emailService;
    private final VerificationCodeRepository verificationCodeRepository;
    private final VerificationService verificationService;
    private final JwtProvider jwtProvider;
    private final CustomeUserServiceImplementation customeUserServiceImplementation;
    private final SellerRepository sellerRepository;
    private final PasswordEncoder passwordEncoder;

    private final CommissionSettingRepository commissionRepo;
    private final OrderRepository orderRepository;

    @Value("${frontend.url:http://localhost:5173}")
    private String frontendUrl;

    // ─── Public: Phase 1 — Seller Account Creation ───────────────
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> registerSeller(
            @Valid @RequestBody SellerRegisterRequest req) throws SellerException, MessagingException {

        // 1. Validate OTP
        String email = req.getEmail();
        VerificationCode code = verificationCodeRepository.findByEmail(email);
        if (code == null || !code.getOtp().equals(req.getOtp())) {
            throw new SellerException("Invalid or expired OTP. Please try again.");
        }
        if (code.getExpiryTime() != null && code.getExpiryTime().isBefore(java.time.LocalDateTime.now())) {
            verificationCodeRepository.delete(code);
            throw new SellerException("OTP expired. Please request a new one.");
        }
        verificationCodeRepository.delete(code);

        // 2. Check duplicate email
        if (sellerRepository.findByEmail(email) != null) {
            throw new SellerException("A seller account with this email already exists. Please login.");
        }

        // 3. Create seller with minimal info
        Seller seller = new Seller();
        seller.setSellerName(req.getFullName());
        seller.setEmail(email);
        seller.setPassword(passwordEncoder.encode(req.getPassword()));
        seller.setRole(USER_ROLE.ROLE_SELLER);
        seller.setIsEmailVerified(true);  // OTP verified above
        seller.setAccountStatus(AccountStatus.PENDING_ONBOARDING);
        seller.setPickupAddress(new Address());
        seller.setBusinessDetails(new BusinessDetails());
        seller.setBankDetails(new BankDetails());

        Seller saved = sellerRepository.save(seller);

        // 4. Generate JWT
        Authentication authentication = authenticateSeller(email);
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String token = jwtProvider.generateToken(authentication);

        AuthResponse response = new AuthResponse();
        response.setJwt(token);
        response.setMessage("Seller account created. Complete your profile to get started.");
        response.setRole(USER_ROLE.ROLE_SELLER);

        log.info("New seller registered (phase 1): {}", email);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    // ─── Public: Seller Login (Email + Password) ─────────────────
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> loginSeller(
            @RequestBody LoginRequest req) throws SellerException {

        Seller seller = sellerRepository.findByEmail(req.getEmail());
        if (seller == null) {
            throw new SellerException("No seller account found with this email.");
        }
        if (!passwordEncoder.matches(req.getPassword(), seller.getPassword())) {
            throw new SellerException("Invalid email or password.");
        }

        Authentication authentication = authenticateSeller(req.getEmail());
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String token = jwtProvider.generateToken(authentication);

        AuthResponse response = new AuthResponse();
        response.setJwt(token);
        response.setMessage("Login successful");
        response.setRole(USER_ROLE.ROLE_SELLER);
        response.setStatus(seller.getAccountStatus() != AccountStatus.PENDING_ONBOARDING);

        log.info("Seller logged in: {}", req.getEmail());
        return ResponseEntity.ok(response);
    }

    // ─── Protected: Phase 2 — Complete Seller Onboarding ─────────
    @PatchMapping("/onboarding")
    public ResponseEntity<Seller> completeOnboarding(
            @RequestHeader("Authorization") String jwt,
            @RequestBody SellerOnboardingRequest req) throws SellerException {

        // JWT stores "seller_" + email as subject — strip the prefix
        String rawEmail = jwtProvider.getEmailFromJwtToken(jwt);
        String email = rawEmail.startsWith("seller_") ? rawEmail.substring(7) : rawEmail;
        log.info("Onboarding request for email: {}", email);

        Seller seller = sellerService.getSellerByEmail(email);
        log.info("Seller found: id={}, status={}", seller.getId(), seller.getAccountStatus());

        // ── Tax Details ──
        if (req.getGstin() != null)          seller.setGSTIN(req.getGstin());
        if (req.getPanNumber() != null)      seller.setPanNumber(req.getPanNumber());
        if (req.getPanName() != null)        seller.setPanName(req.getPanName());
        if (req.getPanDocumentUrl() != null) seller.setPanDocumentUrl(req.getPanDocumentUrl());

        // ── Store Details ──
        // @Embedded objects return null when all DB columns are null — always null-guard them
        BusinessDetails bd = seller.getBusinessDetails();
        if (bd == null) bd = new BusinessDetails();
        if (req.getStoreName() != null) bd.setBusinessName(req.getStoreName());
        seller.setBusinessDetails(bd);

        // ── Pickup Address (@OneToOne) ──
        Address addr = seller.getPickupAddress();
        if (addr == null) addr = new Address();
        if (req.getPincode() != null) addr.setPinCode(req.getPincode());
        if (req.getCity() != null)    addr.setCity(req.getCity());
        if (req.getState() != null)   addr.setState(req.getState());
        if (req.getStreet() != null)  addr.setAddress(req.getStreet());
        seller.setPickupAddress(addr);

        // ── Bank Details (@Embedded) ──
        BankDetails bank = seller.getBankDetails();
        if (bank == null) bank = new BankDetails();
        if (req.getAccountHolderName() != null) bank.setAccountHolderName(req.getAccountHolderName());
        if (req.getAccountNumber() != null)     bank.setAccountNumber(req.getAccountNumber());
        if (req.getIfscCode() != null)          bank.setIfscCode(req.getIfscCode());
        seller.setBankDetails(bank);

        // Move status forward
        seller.setAccountStatus(AccountStatus.PENDING_VERIFICATION);

        try {
            Seller updated = sellerRepository.save(seller);
            log.info("Seller onboarding completed: {}", email);
            return ResponseEntity.ok(updated);
        } catch (Exception ex) {
            log.error("Failed to save seller during onboarding: {}", ex.getMessage(), ex);
            throw new SellerException("Onboarding save failed: " + ex.getMessage());
        }
    }

    // ─── Public: OTP bhejo (for signup) ──────────────────────────
    @PostMapping("/sent/login-top")
    public ResponseEntity<ApiResponse> sentLoginOtp(
            @RequestBody VerificationCode req) throws MessagingException, SellerException {

        Seller seller = sellerService.getSellerByEmail(req.getEmail());
        String otp = OtpUtils.generateOTP();
        verificationService.createVerificationCode(otp, req.getEmail());

        emailService.sendVerificationOtpEmail(
                req.getEmail(), otp,
                "Annadata Market — Login OTP",
                "Aapka login OTP hai: "
        );

        ApiResponse res = new ApiResponse();
        res.setMessage("OTP sent successfully");
        return new ResponseEntity<>(res, HttpStatus.OK);
    }

    // ─── Public: OTP verify karke login ─────────────────────────
    @PostMapping("/verify/login-top")
    public ResponseEntity<AuthResponse> verifyLoginOtp(
            @RequestBody VerificationCode req) throws SellerException {



        String otp = req.getOtp();
        String email = req.getEmail();

         VerificationCode verificationCode = verificationCodeRepository.findByEmail(email);

        System.out.println("EMAIL FROM REQUEST = " + req.getEmail());
    System.out.println("OTP FROM REQUEST = " + req.getOtp());

//     VerificationCode verificationCode =
//             verificationCodeRepository.findByEmail(req.getEmail());

    System.out.println("OTP FROM DB = "
            + (verificationCode != null ? verificationCode.getOtp() : "NULL"));



       
        if (verificationCode == null || !verificationCode.getOtp().equals(otp)) {
            throw new SellerException("Invalid OTP");
        }

        Authentication authentication = authenticateSeller(email);
        SecurityContextHolder.getContext().setAuthentication(authentication);

        String token = jwtProvider.generateToken(authentication);

        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
        String roleName = authorities.isEmpty() ? null
                : authorities.iterator().next().getAuthority();

        AuthResponse authResponse = new AuthResponse();
        authResponse.setMessage("Login successful");
        authResponse.setJwt(token);
        authResponse.setRole(USER_ROLE.valueOf(roleName));

        log.info("Seller logged in: {}", email);
        return new ResponseEntity<>(authResponse, HttpStatus.OK);
    }

    // ─── Public: Email verify karo OTP se ───────────────────────
    @PatchMapping("/verify/{otp}")
    public ResponseEntity<Seller> verifySellerEmail(
            @PathVariable String otp) throws SellerException {

        VerificationCode verificationCode = verificationCodeRepository.findByOtp(otp);
        if (verificationCode == null || !verificationCode.getOtp().equals(otp)) {
            throw new SellerException("Invalid OTP");
        }

        Seller seller = sellerService.verifyEmail(verificationCode.getEmail(), otp);
        return new ResponseEntity<>(seller, HttpStatus.OK);
    }

    // ─── Public: Seller register ─────────────────────────────────
    @PostMapping
    public ResponseEntity<Seller> createSeller(
            @RequestBody Seller seller) throws SellerException, MessagingException {

        Seller savedSeller = sellerService.createSeller(seller);

        String otp = OtpUtils.generateOTP();
        verificationService.createVerificationCode(otp, seller.getEmail());

        String verificationLink = frontendUrl + "/verify-seller/" + otp;
        emailService.sendVerificationOtpEmail(
                seller.getEmail(), otp,
                "Annadata Market — Email Verification",
                "Welcome! Apna account verify karein: " + verificationLink
        );

        log.info("New seller registered: {}", seller.getEmail());
        return new ResponseEntity<>(savedSeller, HttpStatus.CREATED);
    }

    // ─── Public: Seller by ID ────────────────────────────────────
    @GetMapping("/{id}")
    public ResponseEntity<Seller> getSellerById(
            @PathVariable Long id) throws SellerException {

        Seller seller = sellerService.getSellerById(id);
        return new ResponseEntity<>(seller, HttpStatus.OK);
    }

    // ─── Protected: Seller ka apna profile ──────────────────────
    @GetMapping("/profile")
    public ResponseEntity<Seller> getSellerByJwt(
            @RequestHeader("Authorization") String jwt) throws SellerException {

        String email = jwtProvider.getEmailFromJwtToken(jwt);
        Seller seller = sellerService.getSellerByEmail(email);
        return new ResponseEntity<>(seller, HttpStatus.OK);
    }

    // ─── Protected: Seller report ────────────────────────────────
    @GetMapping("/report")
    public ResponseEntity<SellerReport> getSellerReport(
            @RequestHeader("Authorization") String jwt) throws SellerException {

        String email = jwtProvider.getEmailFromJwtToken(jwt);
        Seller seller = sellerService.getSellerByEmail(email);
        SellerReport report = sellerReportService.getSellerReport(seller);
        return new ResponseEntity<>(report, HttpStatus.OK);
    }

    // ─── Admin: Saare sellers ────────────────────────────────────
    @GetMapping
    public ResponseEntity<List<Seller>> getAllSellers(
            @RequestParam(required = false) AccountStatus status) {

        List<Seller> sellers = sellerService.getAllSellers(status);
        return ResponseEntity.ok(sellers);
    }

    // ─── Protected: Seller profile update ───────────────────────
    @PatchMapping
    public ResponseEntity<Seller> updateSeller(
            @RequestHeader("Authorization") String jwt,
            @RequestBody Seller seller) throws SellerException {

        Seller profile = sellerService.getSellerProfile(jwt);
        Seller updatedSeller = sellerService.updateSeller(profile.getId(), seller);
        return ResponseEntity.ok(updatedSeller);
    }

    // ─── Admin: Seller delete ────────────────────────────────────
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSeller(
            @PathVariable Long id) throws SellerException {

        sellerService.deleteSeller(id);
        return ResponseEntity.noContent().build();
    }

    // ─── Private helper ──────────────────────────────────────────
    private Authentication authenticateSeller(String email) {
        // seller_ prefix se seller ka UserDetails load hota hai
        UserDetails userDetails = customeUserServiceImplementation
                .loadUserByUsername("seller_" + email);

        if (userDetails == null) {
            throw new BadCredentialsException("Seller not found: " + email);
        }
        return new UsernamePasswordAuthenticationToken(
                userDetails, null, userDetails.getAuthorities());
    }


    @GetMapping("/commission-preview/{orderId}")
public CommissionSummaryResponse previewCommission(
        @PathVariable Long orderId
) {

    Order order =
            orderRepository.findById(orderId).orElseThrow();

    CommissionSetting setting =
            commissionRepo.findTopByOrderByCreatedAtDesc()
                    .orElseThrow();

    double orderAmount =
            order.getTotalSellingPrice();

    double commission =
            orderAmount *
            setting.getPlatformCommissionPercent() / 100;

    double delivery =
            setting.getDeliveryCharge();

    double farmerReceives =
            orderAmount -
            commission -
            delivery;

    CommissionSummaryResponse response =
            new CommissionSummaryResponse();

    response.setOrderAmount(orderAmount);

    response.setCommissionPercent(
            setting.getPlatformCommissionPercent()
    );

    response.setCommissionAmount(
            commission
    );

    response.setDeliveryCharge(
            delivery
    );

    response.setFarmerReceives(
            farmerReceives
    );

    return response;
}
}
