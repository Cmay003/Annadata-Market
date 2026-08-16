package com.zosh.service.impl;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.zosh.config.JwtProvider;
import com.zosh.domain.USER_ROLE;
import com.zosh.exception.SellerException;
import com.zosh.exception.UserException;
import com.zosh.model.Cart;
import com.zosh.model.User;
import com.zosh.model.VerificationCode;
import com.zosh.repository.CartRepository;
import com.zosh.repository.UserRepository;
import com.zosh.repository.VerificationCodeRepository;
import com.zosh.request.LoginRequest;
import com.zosh.request.SignupRequest;
import com.zosh.response.AuthResponse;
import com.zosh.service.AuthService;
import com.zosh.service.EmailService;
import com.zosh.service.UserService;
import com.zosh.utils.OtpUtils;

import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserService userService;

    private final VerificationCodeRepository verificationCodeRepository;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;

    private final JwtProvider jwtProvider;
    private final CustomeUserServiceImplementation customUserDetails;
    private final CartRepository cartRepository;


    // @Override
    // public void sentLoginOtp(String email) throws UserException, MessagingException {


    //     String SIGNING_PREFIX = "signing_";

    //     if (email.startsWith(SIGNING_PREFIX)) {
    //         email = email.substring(SIGNING_PREFIX.length());
    //         userService.findUserByEmail(email);
    //     }

    //     VerificationCode isExist = verificationCodeRepository
    //             .findByEmail(email);
                

    //     if (isExist != null) {
    //         verificationCodeRepository.delete(isExist);
    //     }

    //     String otp = OtpUtils.generateOTP();

    //     VerificationCode verificationCode = new VerificationCode();
    //     verificationCode.setOtp(otp);
    //     verificationCode.setEmail(email);
    //     verificationCodeRepository.save(verificationCode);

    //     String subject = "Annadata Market Login/Signup Otp";
    //     String text = "your login otp is - ";
    //     emailService.sendVerificationOtpEmail(email, otp, subject, text);
    // }

    @Override
public void sentLoginOtp(String email) throws UserException, MessagingException {

    String SIGNING_PREFIX = "signing_";

    if (email.startsWith(SIGNING_PREFIX)) {
        email = email.substring(SIGNING_PREFIX.length());
        userService.findUserByEmail(email);
    }

    VerificationCode old = verificationCodeRepository.findByEmail(email);

    // ✅ Rate limit (30 sec)
    if (old != null && old.getCreatedAt() != null &&
        old.getCreatedAt().isAfter(LocalDateTime.now().minusSeconds(30))) {
        throw new UserException("Wait before requesting new OTP");
    }

    if (old != null) {
        verificationCodeRepository.delete(old);
    }

    String otp = OtpUtils.generateOTP();

    VerificationCode code = new VerificationCode();
    code.setEmail(email);
    code.setOtp(otp);
    code.setCreatedAt(LocalDateTime.now());
    code.setExpiryTime(LocalDateTime.now().plusMinutes(5)); // ✅ expiry
    code.setAttempts(0);

    verificationCodeRepository.save(code);

    emailService.sendVerificationOtpEmail(
            email, otp,
            "Annadata Market Login/Signup Otp",
            "Your OTP is: "
    );
}

    // @Override
    // public String createUser(SignupRequest req) throws SellerException {

    //     String email = req.getEmail();

    //     String fullName = req.getFullName();

    //     String otp = req.getOtp();

    //     VerificationCode verificationCode = verificationCodeRepository.findByEmail(email);

    //     if (verificationCode == null || !verificationCode.getOtp().equals(otp)) {
    //         throw new SellerException("wrong otp...");
    //     }

    //     User user = userRepository.findByEmail(email);

    //     if (user == null) {

    //         User createdUser = new User();
    //         createdUser.setEmail(email);
    //         createdUser.setFullName(fullName);
    //         createdUser.setRole(USER_ROLE.ROLE_CUSTOMER);
    //         createdUser.setMobile("9083476123");
    //         createdUser.setPassword(passwordEncoder.encode(otp));

    //         System.out.println(createdUser);

    //         user = userRepository.save(createdUser);

    //         Cart cart = new Cart();
    //         cart.setUser(user);
    //         cartRepository.save(cart);
    //     }


    //     List<GrantedAuthority> authorities = new ArrayList<>();

    //     authorities.add(new SimpleGrantedAuthority(
    //             USER_ROLE.ROLE_CUSTOMER.toString()));


    //     Authentication authentication = new UsernamePasswordAuthenticationToken(
    //             email, null, authorities);
    //     SecurityContextHolder.getContext().setAuthentication(authentication);

    //     return jwtProvider.generateToken(authentication);
    // }

    @Override
    public String createUser(SignupRequest req) throws SellerException {

        String email = req.getEmail();
        String fullName = req.getFullName();
        String otp = req.getOtp();
        String rawPassword = req.getPassword();

        VerificationCode code = verificationCodeRepository.findByEmail(email);

        // ❌ OTP not found
        if (code == null) {
            throw new SellerException("OTP not found. Please request a new OTP.");
        }

        // ❌ Expired OTP
        if (code.getExpiryTime() == null ||
                code.getExpiryTime().isBefore(LocalDateTime.now())) {
            verificationCodeRepository.delete(code);
            throw new SellerException("OTP expired. Please request a new OTP.");
        }

        // ❌ Wrong OTP
        if (!code.getOtp().equals(otp)) {
            throw new SellerException("Invalid OTP. Please check your email.");
        }

        // ✅ OTP verified → delete it
        verificationCodeRepository.delete(code);

        // Check if email already registered
        if (userRepository.findByEmail(email) != null) {
            throw new SellerException("An account with this email already exists. Please login.");
        }

        User createdUser = new User();
        createdUser.setEmail(email);
        createdUser.setFullName(fullName);
        createdUser.setRole(USER_ROLE.ROLE_CUSTOMER);
        createdUser.setMobile("");
        createdUser.setPassword(passwordEncoder.encode(rawPassword));

        User user = userRepository.save(createdUser);

        Cart cart = new Cart();
        cart.setUser(user);
        cartRepository.save(cart);

        List<GrantedAuthority> authorities = new ArrayList<>();
        authorities.add(new SimpleGrantedAuthority(USER_ROLE.ROLE_CUSTOMER.toString()));

        Authentication authentication = new UsernamePasswordAuthenticationToken(
                email, null, authorities);

        SecurityContextHolder.getContext().setAuthentication(authentication);

        return jwtProvider.generateToken(authentication);
    }

    @Override
    public AuthResponse signin(LoginRequest req) throws SellerException {

        String username = req.getEmail();
        String password = req.getPassword();

        Authentication authentication = authenticate(username, password);
        SecurityContextHolder.getContext().setAuthentication(authentication);

        String token = jwtProvider.generateToken(authentication);
        AuthResponse authResponse = new AuthResponse();

        authResponse.setMessage("Login Success");
        authResponse.setJwt(token);
        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();

        String roleName = authorities.isEmpty() ? null : authorities.iterator().next().getAuthority();
        authResponse.setRole(USER_ROLE.valueOf(roleName));

        return authResponse;
    }



    // private Authentication authenticate(String username, String otp) throws SellerException {
    //     UserDetails userDetails = customUserDetails.loadUserByUsername(username);

    //     System.out.println("sign in userDetails - " + userDetails);

    //     if (userDetails == null) {
    //         System.out.println("sign in userDetails - null ");
    //         throw new BadCredentialsException("Invalid username or password");
    //     }
    //     VerificationCode verificationCode = verificationCodeRepository.findByEmail(username);

    //     if (verificationCode == null || !verificationCode.getOtp().equals(otp)) {
    //         throw new SellerException("wrong otp...");
    //     }
    //     return new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
    // }


    private Authentication authenticate(String username, String password) throws SellerException {

        UserDetails userDetails = customUserDetails.loadUserByUsername(username);

        if (userDetails == null) {
            throw new BadCredentialsException("Invalid email or password");
        }

        if (!passwordEncoder.matches(password, userDetails.getPassword())) {
            throw new BadCredentialsException("Invalid email or password");
        }

        return new UsernamePasswordAuthenticationToken(
                userDetails, null, userDetails.getAuthorities());
    }


private void validateOtp(String email, String otp) throws SellerException {

    VerificationCode code = verificationCodeRepository.findByEmail(email);

    if (code == null) {
        throw new SellerException("OTP not found");
    }

    // ✅ Expiry check
    if (code.getExpiryTime() == null || code.getExpiryTime().isBefore(LocalDateTime.now())) {
        verificationCodeRepository.delete(code);
        throw new SellerException("OTP expired");
    }

    // ✅ Attempt limit
    if (code.getAttempts() >= 3) {
        verificationCodeRepository.delete(code);
        throw new SellerException("Too many attempts. Try again later.");
    }

    // ❌ Wrong OTP
    if (!code.getOtp().equals(otp)) {
        code.setAttempts(code.getAttempts() + 1);
        verificationCodeRepository.save(code);
        throw new SellerException("Invalid OTP");
    }

    // ✅ Success → delete OTP
    verificationCodeRepository.delete(code);
}
}
