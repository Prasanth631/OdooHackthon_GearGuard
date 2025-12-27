package com.gearguard.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TeamMemberDTO {

    private Long id;
    private Long memberId;
    private Long userId;
    private String fullName;
    private String email;
    private String role;
    private Boolean isLead;
    private LocalDateTime joinedAt;
}
