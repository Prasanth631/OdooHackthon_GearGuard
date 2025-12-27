package com.gearguard.service;

import com.gearguard.dto.AuthResponse;
import com.gearguard.dto.LoginRequest;
import com.gearguard.dto.SignupRequest;
import com.gearguard.dto.UserDTO;
import com.gearguard.model.OtpToken;
import com.gearguard.model.User;
import com.gearguard.model.enums.UserRole;
import com.gearguard.repository.OtpTokenRepository;
import com.gearguard.repository.UserRepository;
import com.gearguard.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private OtpTokenRepository otpTokenRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private AuthenticationManager authenticationManager;

    private static final SecureRandom secureRandom = new SecureRandom();

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found with email: " + request.getEmail()));

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(user.getEmail(), request.getPassword()));

        // Generate token with EMAIL as subject (not username)
        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name(), user.getId());

        return AuthResponse.builder()
                .token(token)
                .id(user.getId())
                .username(user.getUsername())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .role(user.getRole())
                .message("Login successful")
                .build();
    }

    public AuthResponse setupAdmin(SignupRequest request) {
        if (userRepository.findByRole(UserRole.ADMIN).size() > 0) {
            throw new RuntimeException("Admin already exists");
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        String username = request.getUsername();
        if (username == null || username.isEmpty()) {
            username = request.getEmail().split("@")[0];
        }

        if (userRepository.existsByUsername(username)) {
            username = username + System.currentTimeMillis() % 1000;
        }

        User admin = User.builder()
                .username(username)
                .password(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName())
                .email(request.getEmail())
                .role(UserRole.ADMIN)
                .active(true)
                .build();

        userRepository.save(admin);

        // Generate token with EMAIL as subject
        String token = jwtUtil.generateToken(admin.getEmail(), admin.getRole().name(), admin.getId());

        return AuthResponse.builder()
                .token(token)
                .id(admin.getId())
                .username(admin.getUsername())
                .fullName(admin.getFullName())
                .email(admin.getEmail())
                .role(admin.getRole())
                .message("Admin account created successfully")
                .build();
    }

    public AuthResponse createUser(SignupRequest request, UserRole creatorRole) {
        if (creatorRole == UserRole.TECHNICIAN || creatorRole == UserRole.USER) {
            throw new RuntimeException("You don't have permission to create users");
        }

        if (creatorRole == UserRole.MANAGER && request.getRole() == UserRole.ADMIN) {
            throw new RuntimeException("Managers cannot create admin accounts");
        }

        if (creatorRole == UserRole.MANAGER && request.getRole() == UserRole.MANAGER) {
            throw new RuntimeException("Managers cannot create other manager accounts");
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        String username = request.getUsername();
        if (username == null || username.isEmpty()) {
            username = request.getEmail().split("@")[0];
        }

        if (userRepository.existsByUsername(username)) {
            username = username + System.currentTimeMillis() % 1000;
        }

        User newUser = User.builder()
                .username(username)
                .password(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName())
                .email(request.getEmail())
                .role(request.getRole())
                .active(true)
                .build();

        userRepository.save(newUser);

        return AuthResponse.builder()
                .id(newUser.getId())
                .username(newUser.getUsername())
                .fullName(newUser.getFullName())
                .email(newUser.getEmail())
                .role(newUser.getRole())
                .message("User created successfully")
                .build();
    }

    public boolean adminExists() {
        return userRepository.findByRole(UserRole.ADMIN).size() > 0;
    }

    public List<UserDTO> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::toUserDTO)
                .collect(Collectors.toList());
    }

    public List<UserDTO> getUsersByRole(UserRole role) {
        return userRepository.findByRole(role).stream()
                .map(this::toUserDTO)
                .collect(Collectors.toList());
    }

    private UserDTO toUserDTO(User user) {
        return UserDTO.builder()
                .id(user.getId())
                .username(user.getUsername())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .role(user.getRole())
                .avatarUrl(user.getAvatarUrl())
                .active(user.getActive())
                .build();
    }

    // Forgot Password Methods

    private String generateOtp() {
        int otp = 100000 + secureRandom.nextInt(900000);
        return String.valueOf(otp);
    }

    @Transactional
    public void sendPasswordResetOtp(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("No account found with this email address"));

        // Delete any existing OTPs for this email
        otpTokenRepository.deleteByEmail(email);

        // Generate new OTP
        String otp = generateOtp();

        // Create OTP token (expires in 10 minutes)
        OtpToken otpToken = OtpToken.builder()
                .email(email)
                .otp(otp)
                .expiresAt(LocalDateTime.now().plusMinutes(10))
                .used(false)
                .build();

        otpTokenRepository.save(otpToken);

        // Send OTP via email
        emailService.sendOtpEmail(email, otp);
    }

    public boolean verifyOtp(String email, String otp) {
        OtpToken otpToken = otpTokenRepository.findByEmailAndOtpAndUsedFalse(email, otp)
                .orElseThrow(() -> new RuntimeException("Invalid OTP"));

        if (otpToken.isExpired()) {
            throw new RuntimeException("OTP has expired. Please request a new one.");
        }

        return true;
    }

    @Transactional
    public void resetPassword(String email, String otp, String newPassword) {
        OtpToken otpToken = otpTokenRepository.findByEmailAndOtpAndUsedFalse(email, otp)
                .orElseThrow(() -> new RuntimeException("Invalid OTP"));

        if (otpToken.isExpired()) {
            throw new RuntimeException("OTP has expired. Please request a new one.");
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Update password
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        // Mark OTP as used
        otpToken.setUsed(true);
        otpTokenRepository.save(otpToken);

        // Cleanup expired tokens
        otpTokenRepository.deleteExpiredTokens(LocalDateTime.now());
    }

    public void changeCurrentUserPassword(String email, String currentPassword, String newPassword) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Verify current password
        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            throw new RuntimeException("Current password is incorrect");
        }

        // Update password
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }
}
