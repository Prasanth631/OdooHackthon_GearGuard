package com.gearguard.dto;

import com.gearguard.model.enums.Priority;
import com.gearguard.model.enums.RequestStage;
import com.gearguard.model.enums.RequestType;
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
public class MaintenanceRequestDTO {

    private Long id;
    private String subject;
    private String description;

    // Equipment info
    private Long equipmentId;
    private String equipmentName;
    private String equipmentLocation;

    // Type, Stage, Priority
    private RequestType type;
    private RequestStage stage;
    private Priority priority;

    // Assignment
    private Long assignedTeamId;
    private String assignedTeamName;
    private String assignedTeamColor;
    private Long assignedToId;
    private String assignedToName;

    // Requester
    private Long requestedById;
    private String requestedByName;

    // Dates
    private LocalDate scheduledDate;
    private LocalDateTime completedAt;
    private Integer estimatedDuration;
    private Boolean isOverdue;

    // Notes
    private String notes;

    // Timestamps
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
