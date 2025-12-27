package com.gearguard.dto;

import com.gearguard.model.enums.EquipmentStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EquipmentDTO {
    private Long id;
    private String name;
    private String serialNumber;
    private String category;
    private String department;
    private Long departmentId;
    private String assignedTo;
    private Long assignedToId;
    private String maintenanceTeam;
    private Long maintenanceTeamId;
    private LocalDate purchaseDate;
    private LocalDate warrantyExpiry;
    private String location;
    private EquipmentStatus status;
    private Integer healthScore;
    private String notes;
    private Boolean underWarranty;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
