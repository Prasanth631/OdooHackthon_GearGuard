package com.gearguard.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "maintenance_teams")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MaintenanceTeam {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 100)
    private String name;

    @Column(length = 500)
    private String description;

    @Column(length = 7)
    @Builder.Default
    private String color = "#3B82F6";

    @OneToMany(mappedBy = "team", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<TeamMember> members = new ArrayList<>();

    @Column(name = "created_at")
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    public void addMember(User user, boolean isLead) {
        TeamMember member = TeamMember.builder()
                .team(this)
                .user(user)
                .isLead(isLead)
                .build();
        members.add(member);
    }
}
