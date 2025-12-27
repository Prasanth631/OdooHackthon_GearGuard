package com.gearguard.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    @Autowired
    private JavaMailSender mailSender;

    @Value("${app.mail.sender-name:GearGuard Team}")
    private String senderName;

    @Value("${spring.mail.username}")
    private String senderEmail;

    public void sendOtpEmail(String toEmail, String otp) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(senderEmail, senderName);
            helper.setTo(toEmail);
            helper.setSubject("GearGuard - Password Reset OTP");

            // Create HTML email content using String concatenation
            String htmlContent = """
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                        <div style="background: linear-gradient(135deg, #667eea, #764ba2); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
                            <h1 style="color: white; margin: 0; font-size: 28px;">GearGuard</h1>
                            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">The Ultimate Maintenance Tracker</p>
                        </div>
                        <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e9ecef; border-top: none;">
                            <h2 style="color: #333; margin-top: 0;">Password Reset Request</h2>
                            <p style="color: #666; line-height: 1.6;">Hello,</p>
                            <p style="color: #666; line-height: 1.6;">You have requested to reset your password for your GearGuard account. Use the OTP code below to complete the process:</p>
                            <div style="background: #667eea; color: white; font-size: 32px; font-weight: bold; letter-spacing: 8px; padding: 20px; text-align: center; border-radius: 8px; margin: 25px 0;">
                                """
                    + otp
                    + """
                                    </div>
                                    <p style="color: #666; line-height: 1.6;">This code will expire in <strong>10 minutes</strong>.</p>
                                    <p style="color: #999; font-size: 14px; line-height: 1.6;">If you did not request this password reset, please ignore this email or contact support if you have concerns.</p>
                                    <hr style="border: none; border-top: 1px solid #e9ecef; margin: 25px 0;">
                                    <p style="color: #999; font-size: 12px; text-align: center; margin: 0;">
                                        2025 GearGuard. All rights reserved.<br>
                                        This is an automated message, please do not reply.
                                    </p>
                                </div>
                            </div>
                            """;

            helper.setText(htmlContent, true);

            mailSender.send(message);
            logger.info("OTP email sent successfully to: {}", toEmail);
        } catch (MessagingException e) {
            logger.error("Failed to send OTP email to: {} - Error: {}", toEmail, e.getMessage());
            throw new RuntimeException("Failed to send OTP email. Please try again later.");
        } catch (Exception e) {
            logger.error("Failed to send OTP email to: {} - Error: {}", toEmail, e.getMessage());
            throw new RuntimeException("Failed to send OTP email. Please try again later.");
        }
    }
}
