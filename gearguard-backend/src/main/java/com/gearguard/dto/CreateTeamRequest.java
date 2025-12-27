package com.gearguard.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateTeamRequest {

    @NotBlank(message = "Team name is required")
    @Size(max = 100)
    private String name;

    @Size(max = 500)
    private String description;

    @Size(max = 7)
    private String color;
}
