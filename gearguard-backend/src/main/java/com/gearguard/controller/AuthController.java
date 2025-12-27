package com.gearguard.controller;

import com.gearguard.dto.AuthResponse;
import com.gearguard.dto.ForgotPasswordRequest;
import com.gearguard.dto.LoginRequest;
import com.gearguard.dto.ResetPasswordRequest;
import com.gearguard.dto.SignupRequest;
import com.gearguard.dto.UserDTO;
import com.gearguard.dto.VerifyOtpRequest;
import com.gearguard.model.User;
import com.gearguard.model.enums.UserRole;
import com.gearguard.repository.UserRepository;
import com.gearguard.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        try {
            AuthResponse response = authService.login(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                    AuthResponse.builder().message("Invalid credentials").build());
        }
    }

    @PostMapping("/setup-admin")
    public ResponseEntity<AuthResponse> setupAdmin(@Valid @RequestBody SignupRequest request) {
        try {
            AuthResponse response = authService.setupAdmin(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                    AuthResponse.builder().message(e.getMessage()).build());
        }
    }

    @GetMapping("/check-admin")
    public ResponseEntity<Map<String, Boolean>> checkAdminExists() {
        Map<String, Boolean> response = new HashMap<>();
        response.put("adminExists", authService.adminExists());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/create-user")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<AuthResponse> createUser(@Valid @RequestBody SignupRequest request) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String email = auth.getName(); // Principal is now email
            User currentUser = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            AuthResponse response = authService.createUser(request, currentUser.getRole());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                    AuthResponse.builder().message(e.getMessage()).build());
        }
    }

    @GetMapping("/me")
    public ResponseEntity<UserDTO> getCurrentUser() {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String email = auth.getName(); // Principal is now email
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            UserDTO dto = UserDTO.builder()
                    .id(user.getId())
                    .username(user.getUsername())
                    .fullName(user.getFullName())
                    .email(user.getEmail())
                    .role(user.getRole())
                    .avatarUrl(user.getAvatarUrl())
                    .active(user.getActive())
                    .build();

            return ResponseEntity.ok(dto);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/users")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        return ResponseEntity.ok(authService.getAllUsers());
    }

    @GetMapping("/users/role/{role}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<List<UserDTO>> getUsersByRole(@PathVariable UserRole role) {
        return ResponseEntity.ok(authService.getUsersByRole(role));
    }

    // Forgot Password Endpoints

    @PostMapping("/forgot-password")
    public ResponseEntity<Map<String, String>> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        try {
            authService.sendPasswordResetOtp(request.getEmail());
            Map<String, String> response = new HashMap<>();
            response.put("message", "OTP sent successfully to your email");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<Map<String, Object>> verifyOtp(@Valid @RequestBody VerifyOtpRequest request) {
        try {
            boolean valid = authService.verifyOtp(request.getEmail(), request.getOtp());
            Map<String, Object> response = new HashMap<>();
            response.put("valid", valid);
            response.put("message", "OTP verified successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("valid", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<Map<String, String>> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        try {
            authService.resetPassword(request.getEmail(), request.getOtp(), request.getNewPassword());
            Map<String, String> response = new HashMap<>();
            response.put("message", "Password reset successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PutMapping("/profile")
    public ResponseEntity<UserDTO> updateProfile(@RequestBody Map<String, Object> updates) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String email = auth.getName();
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // Update allowed fields
            if (updates.containsKey("fullName")) {
                user.setFullName((String) updates.get("fullName"));
            }
            if (updates.containsKey("phone")) {
                user.setPhone((String) updates.get("phone"));
            }
            if (updates.containsKey("avatarUrl")) {
                user.setAvatarUrl((String) updates.get("avatarUrl"));
            }

            userRepository.save(user);

            UserDTO dto = UserDTO.builder()
                    .id(user.getId())
                    .username(user.getUsername())
                    .fullName(user.getFullName())
                    .email(user.getEmail())
                    .role(user.getRole())
                    .avatarUrl(user.getAvatarUrl())
                    .phone(user.getPhone())
                    .active(user.getActive())
                    .build();

            return ResponseEntity.ok(dto);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/change-password")
    public ResponseEntity<Map<String, String>> changePassword(@RequestBody Map<String, String> request) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String email = auth.getName();

            String currentPassword = request.get("currentPassword");
            String newPassword = request.get("newPassword");

            authService.changeCurrentUserPassword(email, currentPassword, newPassword);

            Map<String, String> response = new HashMap<>();
            response.put("message", "Password changed successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
}
