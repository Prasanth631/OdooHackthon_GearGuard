package com.gearguard.dto;

import com.gearguard.model.enums.EquipmentStatus;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateEquipmentRequest {

    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Serial number is required")
    private String serialNumber;

    private String category;
    private Long departmentId;
    private Long assignedToId;
    private Long maintenanceTeamId;
    private Long defaultTechnicianId;
    private LocalDate purchaseDate;
    private LocalDate warrantyExpiry;
    private String location;
    private EquipmentStatus status;
    private Integer healthScore;
    private String notes;
}
