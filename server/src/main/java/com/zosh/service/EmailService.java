package com.zosh.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender javaMailSender;

    @Value("${spring.mail.username:}")
    private String fromEmail;

    public void sendVerificationOtpEmail(String userEmail, String otp, String subject, String text) {

        try {
            MimeMessage mimeMessage = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

            if (fromEmail != null && !fromEmail.trim().isEmpty()) {
                helper.setFrom(fromEmail.trim(), "Annadata Market");
            }

            helper.setTo(userEmail);
            helper.setSubject(subject);
            helper.setText("<h2>" + subject + "</h2><p>" + text + "</p><h1 style='color: #16a34a; font-size: 32px;'>" + otp + "</h1>", true);

            javaMailSender.send(mimeMessage);
            System.out.println("✅ Email sent successfully to " + userEmail);
        } catch (Exception e) {
            System.err.println("⚠️ SMTP email send failed for " + userEmail + ": " + e.getMessage());
            e.printStackTrace();
            System.out.println("🔑 [OTP FALLBACK FOR TESTING] OTP for " + userEmail + " is: " + otp);
        }
    }
}
