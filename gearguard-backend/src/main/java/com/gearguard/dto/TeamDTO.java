package com.gearguard.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TeamDTO {

    private Long id;
    private String name;
    private String description;
    private String color;
    private int memberCount;
    private int requestsCount;
    private int completedCount;
    private String leadName;
    private List<TeamMemberDTO> members;
}
