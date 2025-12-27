package com.gearguard.dto;

import com.gearguard.model.enums.Priority;
import com.gearguard.model.enums.RequestType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateRequestDTO {

    @NotBlank(message = "Subject is required")
    private String subject;

    private String description;

    @NotNull(message = "Equipment ID is required")
    private Long equipmentId;

    private RequestType type = RequestType.CORRECTIVE;

    private Priority priority = Priority.MEDIUM;

    private Long assignedTeamId;

    private Long assignedToId;

    private LocalDate scheduledDate;

    private Integer estimatedDuration;

    private String notes;
}
