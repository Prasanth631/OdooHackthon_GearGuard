package com.gearguard.service;

import com.gearguard.dto.AuthResponse;
import com.gearguard.dto.LoginRequest;
import com.gearguard.dto.SignupRequest;
import com.gearguard.dto.UserDTO;
import com.gearguard.model.User;
import com.gearguard.model.enums.UserRole;
import com.gearguard.repository.UserRepository;
import com.gearguard.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private AuthenticationManager authenticationManager;

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found with email: " + request.getEmail()));

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(user.getUsername(), request.getPassword()));

        String token = jwtUtil.generateToken(user.getUsername(), user.getRole().name(), user.getId());

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

        String token = jwtUtil.generateToken(admin.getUsername(), admin.getRole().name(), admin.getId());

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
}
