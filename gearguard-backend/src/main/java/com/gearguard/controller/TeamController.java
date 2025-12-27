package com.gearguard.controller;

import com.gearguard.dto.AddMemberRequest;
import com.gearguard.dto.CreateTeamRequest;
import com.gearguard.dto.TeamDTO;
import com.gearguard.dto.TeamMemberDTO;
import com.gearguard.service.TeamService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/teams")
@CrossOrigin(origins = "*")
public class TeamController {

    @Autowired
    private TeamService teamService;

    @GetMapping
    public ResponseEntity<List<TeamDTO>> getAllTeams() {
        return ResponseEntity.ok(teamService.getAllTeams());
    }

    @GetMapping("/{id}")
    public ResponseEntity<TeamDTO> getTeamById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(teamService.getTeamById(id));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<?> createTeam(@Valid @RequestBody CreateTeamRequest request) {
        try {
            TeamDTO team = teamService.createTeam(request);
            return ResponseEntity.ok(team);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<?> updateTeam(@PathVariable Long id, @Valid @RequestBody CreateTeamRequest request) {
        try {
            TeamDTO team = teamService.updateTeam(id, request);
            return ResponseEntity.ok(team);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteTeam(@PathVariable Long id) {
        try {
            teamService.deleteTeam(id);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Team deleted successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @GetMapping("/{id}/members")
    public ResponseEntity<List<TeamMemberDTO>> getTeamMembers(@PathVariable Long id) {
        return ResponseEntity.ok(teamService.getTeamMembers(id));
    }

    @PostMapping("/{id}/members")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<?> addMember(@PathVariable Long id, @Valid @RequestBody AddMemberRequest request) {
        try {
            TeamMemberDTO member = teamService.addMember(id, request);
            return ResponseEntity.ok(member);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @DeleteMapping("/{id}/members/{memberId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<?> removeMember(@PathVariable Long id, @PathVariable Long memberId) {
        try {
            teamService.removeMember(id, memberId);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Member removed successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PutMapping("/{id}/lead/{memberId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<?> setTeamLead(@PathVariable Long id, @PathVariable Long memberId) {
        try {
            TeamMemberDTO member = teamService.setTeamLead(id, memberId);
            return ResponseEntity.ok(member);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
}
