package com.gearguard.controller;

import com.gearguard.dto.CreateEquipmentRequest;
import com.gearguard.dto.EquipmentDTO;
import com.gearguard.model.enums.EquipmentStatus;
import com.gearguard.service.EquipmentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/equipment")
public class EquipmentController {

    @Autowired
    private EquipmentService equipmentService;

    @GetMapping
    public ResponseEntity<List<EquipmentDTO>> getAllEquipment(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String category) {

        if (status != null && !status.isEmpty()) {
            return ResponseEntity.ok(equipmentService.getEquipmentByStatus(EquipmentStatus.valueOf(status)));
        }

        if (category != null && !category.isEmpty()) {
            return ResponseEntity.ok(equipmentService.getEquipmentByCategory(category));
        }

        return ResponseEntity.ok(equipmentService.getAllEquipment());
    }

    @GetMapping("/{id}")
    public ResponseEntity<EquipmentDTO> getEquipmentById(@PathVariable Long id) {
        return ResponseEntity.ok(equipmentService.getEquipmentById(id));
    }

    @PostMapping
    public ResponseEntity<EquipmentDTO> createEquipment(@Valid @RequestBody CreateEquipmentRequest request) {
        return ResponseEntity.ok(equipmentService.createEquipment(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<EquipmentDTO> updateEquipment(
            @PathVariable Long id,
            @Valid @RequestBody CreateEquipmentRequest request) {
        return ResponseEntity.ok(equipmentService.updateEquipment(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteEquipment(@PathVariable Long id) {
        equipmentService.deleteEquipment(id);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Equipment deleted successfully");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/categories")
    public ResponseEntity<List<String>> getCategories() {
        return ResponseEntity.ok(equipmentService.getCategories());
    }

    @GetMapping("/statuses")
    public ResponseEntity<List<String>> getStatuses() {
        return ResponseEntity.ok(equipmentService.getStatuses());
    }
}
