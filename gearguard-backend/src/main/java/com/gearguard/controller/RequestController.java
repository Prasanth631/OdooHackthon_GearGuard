package com.gearguard.controller;

import com.gearguard.dto.CreateRequestDTO;
import com.gearguard.dto.MaintenanceRequestDTO;
import com.gearguard.model.User;
import com.gearguard.model.enums.RequestStage;
import com.gearguard.repository.UserRepository;
import com.gearguard.service.MaintenanceRequestService;
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
@RequestMapping("/api/requests")
@CrossOrigin(origins = "*")
public class RequestController {

    @Autowired
    private MaintenanceRequestService requestService;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public ResponseEntity<List<MaintenanceRequestDTO>> getAllRequests() {
        return ResponseEntity.ok(requestService.getAllRequests());
    }

    @GetMapping("/{id}")
    public ResponseEntity<MaintenanceRequestDTO> getRequestById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(requestService.getRequestById(id));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<?> createRequest(@Valid @RequestBody CreateRequestDTO request) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String email = auth.getName();
            User currentUser = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            MaintenanceRequestDTO created = requestService.createRequest(request, currentUser.getId());
            return ResponseEntity.ok(created);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'TECHNICIAN')")
    public ResponseEntity<?> updateRequest(@PathVariable Long id, @Valid @RequestBody CreateRequestDTO request) {
        try {
            MaintenanceRequestDTO updated = requestService.updateRequest(id, request);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PatchMapping("/{id}/stage")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'TECHNICIAN')")
    public ResponseEntity<?> updateStage(@PathVariable Long id, @RequestBody Map<String, String> body) {
        try {
            String stageStr = body.get("stage");
            RequestStage stage = RequestStage.valueOf(stageStr);
            MaintenanceRequestDTO updated = requestService.updateStage(id, stage);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<?> deleteRequest(@PathVariable Long id) {
        try {
            requestService.deleteRequest(id);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Request deleted successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @GetMapping("/stage/{stage}")
    public ResponseEntity<List<MaintenanceRequestDTO>> getByStage(@PathVariable RequestStage stage) {
        return ResponseEntity.ok(requestService.getRequestsByStage(stage));
    }

    @GetMapping("/team/{teamId}")
    public ResponseEntity<List<MaintenanceRequestDTO>> getByTeam(@PathVariable Long teamId) {
        return ResponseEntity.ok(requestService.getRequestsByTeam(teamId));
    }

    @GetMapping("/overdue")
    public ResponseEntity<List<MaintenanceRequestDTO>> getOverdue() {
        return ResponseEntity.ok(requestService.getOverdueRequests());
    }
}
