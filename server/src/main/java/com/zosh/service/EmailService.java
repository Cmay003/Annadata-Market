package com.zosh.service;

import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class EmailService {

    @Autowired(required = false)
    private JavaMailSender javaMailSender;

    @Autowired
    private RestTemplate restTemplate;

    @Value("${spring.mail.username:}")
    private String fromEmail;

    @Value("${resend.api.key:${MAIL_PASSWORD:}}")
    private String resendApiKey;

    public void sendVerificationOtpEmail(String userEmail, String otp, String subject, String text) {
        String apiKey = resendApiKey != null ? resendApiKey.trim() : "";
        
        // 🚀 If Resend API key is provided (starts with re_), send via HTTPS REST API (Port 443)
        // This completely bypasses Railway SMTP port blocks!
        if (apiKey.startsWith("re_")) {
            sendViaResendHttpApi(userEmail, otp, subject, text, apiKey);
            return;
        }

        // Fallback to standard SMTP
        try {
            if (javaMailSender == null) {
                throw new IllegalStateException("JavaMailSender is not configured");
            }
            MimeMessage mimeMessage = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

            if (fromEmail != null && !fromEmail.trim().isEmpty()) {
                helper.setFrom(fromEmail.trim(), "Annadata Market");
            }

            helper.setTo(userEmail);
            helper.setSubject(subject);
            helper.setText("<h2>" + subject + "</h2><p>" + text + "</p><h1 style='color: #16a34a; font-size: 32px;'>" + otp + "</h1>", true);

            javaMailSender.send(mimeMessage);
            System.out.println("✅ Email sent successfully via SMTP to " + userEmail);
        } catch (Exception e) {
            System.err.println("⚠️ SMTP email send failed for " + userEmail + ": " + e.getMessage());
            System.out.println("🔑 [OTP FALLBACK FOR TESTING] OTP for " + userEmail + " is: " + otp);
            throw new RuntimeException("Email Send Failed: " + e.getMessage(), e);
        }
    }

    private void sendViaResendHttpApi(String userEmail, String otp, String subject, String text, String apiKey) {
        try {
            String url = "https://api.resend.com/emails";

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(apiKey);

            String htmlBody = "<h2>" + subject + "</h2><p>" + text + "</p><h1 style='color: #16a34a; font-size: 32px;'>" + otp + "</h1>";

            Map<String, Object> body = new HashMap<>();
            body.put("from", "Annadata Market <onboarding@resend.dev>");
            body.put("to", List.of(userEmail));
            body.put("subject", subject);
            body.put("html", htmlBody);

            HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(body, headers);
            ResponseEntity<String> response = restTemplate.postForEntity(url, requestEntity, String.class);

            if (response.getStatusCode().is2xxSuccessful()) {
                System.out.println("✅ Email sent successfully via Resend HTTPS API to " + userEmail + ": " + response.getBody());
            } else {
                throw new RuntimeException("Resend API returned status: " + response.getStatusCode() + " body: " + response.getBody());
            }
        } catch (Exception e) {
            System.err.println("⚠️ Resend HTTPS API send failed for " + userEmail + ": " + e.getMessage());
            System.out.println("🔑 [OTP FALLBACK FOR TESTING] OTP for " + userEmail + " is: " + otp);
            throw new RuntimeException("Resend HTTPS API Send Failed: " + e.getMessage(), e);
        }
    }
}
