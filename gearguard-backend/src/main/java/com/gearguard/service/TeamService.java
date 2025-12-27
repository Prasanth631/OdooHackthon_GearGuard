package com.gearguard.service;

import com.gearguard.dto.AddMemberRequest;
import com.gearguard.dto.CreateTeamRequest;
import com.gearguard.dto.TeamDTO;
import com.gearguard.dto.TeamMemberDTO;
import com.gearguard.model.MaintenanceTeam;
import com.gearguard.model.TeamMember;
import com.gearguard.model.User;
import com.gearguard.repository.MaintenanceRequestRepository;
import com.gearguard.repository.MaintenanceTeamRepository;
import com.gearguard.repository.TeamMemberRepository;
import com.gearguard.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TeamService {

    @Autowired
    private MaintenanceTeamRepository teamRepository;

    @Autowired
    private TeamMemberRepository memberRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MaintenanceRequestRepository requestRepository;

    public List<TeamDTO> getAllTeams() {
        return teamRepository.findAllWithMembers().stream()
                .map(this::toTeamDTO)
                .collect(Collectors.toList());
    }

    public TeamDTO getTeamById(Long id) {
        MaintenanceTeam team = teamRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Team not found"));
        return toTeamDTO(team);
    }

    @Transactional
    public TeamDTO createTeam(CreateTeamRequest request) {
        if (teamRepository.existsByName(request.getName())) {
            throw new RuntimeException("Team with this name already exists");
        }

        MaintenanceTeam team = MaintenanceTeam.builder()
                .name(request.getName())
                .description(request.getDescription())
                .color(request.getColor() != null ? request.getColor() : "#3B82F6")
                .build();

        teamRepository.save(team);
        return toTeamDTO(team);
    }

    @Transactional
    public TeamDTO updateTeam(Long id, CreateTeamRequest request) {
        MaintenanceTeam team = teamRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Team not found"));

        if (!team.getName().equals(request.getName()) && teamRepository.existsByName(request.getName())) {
            throw new RuntimeException("Team with this name already exists");
        }

        team.setName(request.getName());
        team.setDescription(request.getDescription());
        if (request.getColor() != null) {
            team.setColor(request.getColor());
        }

        teamRepository.save(team);
        return toTeamDTO(team);
    }

    @Transactional
    public void deleteTeam(Long id) {
        MaintenanceTeam team = teamRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Team not found"));
        teamRepository.delete(team);
    }

    public List<TeamMemberDTO> getTeamMembers(Long teamId) {
        return memberRepository.findByTeamId(teamId).stream()
                .map(this::toMemberDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public TeamMemberDTO addMember(Long teamId, AddMemberRequest request) {
        MaintenanceTeam team = teamRepository.findById(teamId)
                .orElseThrow(() -> new RuntimeException("Team not found"));

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (memberRepository.existsByTeamIdAndUserId(teamId, request.getUserId())) {
            throw new RuntimeException("User is already a member of this team");
        }

        TeamMember member = TeamMember.builder()
                .team(team)
                .user(user)
                .isLead(request.getIsLead() != null ? request.getIsLead() : false)
                .build();

        memberRepository.save(member);
        return toMemberDTO(member);
    }

    @Transactional
    public void removeMember(Long teamId, Long memberId) {
        TeamMember member = memberRepository.findById(memberId)
                .orElseThrow(() -> new RuntimeException("Member not found"));

        if (!member.getTeam().getId().equals(teamId)) {
            throw new RuntimeException("Member does not belong to this team");
        }

        memberRepository.delete(member);
    }

    @Transactional
    public TeamMemberDTO setTeamLead(Long teamId, Long memberId) {
        // Remove lead status from current leads
        List<TeamMember> currentLeads = memberRepository.findByTeamIdAndIsLeadTrue(teamId);
        for (TeamMember lead : currentLeads) {
            lead.setIsLead(false);
            memberRepository.save(lead);
        }

        // Set new lead
        TeamMember member = memberRepository.findById(memberId)
                .orElseThrow(() -> new RuntimeException("Member not found"));

        if (!member.getTeam().getId().equals(teamId)) {
            throw new RuntimeException("Member does not belong to this team");
        }

        member.setIsLead(true);
        memberRepository.save(member);
        return toMemberDTO(member);
    }

    private TeamDTO toTeamDTO(MaintenanceTeam team) {
        List<TeamMemberDTO> memberDTOs = team.getMembers() != null
                ? team.getMembers().stream().map(this::toMemberDTO).collect(Collectors.toList())
                : List.of();

        String leadName = team.getMembers() != null
                ? team.getMembers().stream()
                        .filter(m -> Boolean.TRUE.equals(m.getIsLead()))
                        .findFirst()
                        .map(m -> m.getUser().getFullName())
                        .orElse(null)
                : null;

        // Get request counts for this team
        int requestsCount = 0;
        int completedCount = 0;
        try {
            requestsCount = requestRepository.countByMaintenanceTeamIdAndStageNot(team.getId(),
                    com.gearguard.model.enums.RequestStage.REPAIRED);
            completedCount = requestRepository.countByMaintenanceTeamIdAndStage(team.getId(),
                    com.gearguard.model.enums.RequestStage.REPAIRED);
        } catch (Exception e) {
            // Repository methods may not exist yet
        }

        return TeamDTO.builder()
                .id(team.getId())
                .name(team.getName())
                .description(team.getDescription())
                .color(team.getColor())
                .memberCount(memberDTOs.size())
                .requestsCount(requestsCount)
                .completedCount(completedCount)
                .leadName(leadName)
                .members(memberDTOs)
                .build();
    }

    private TeamMemberDTO toMemberDTO(TeamMember member) {
        return TeamMemberDTO.builder()
                .id(member.getId())
                .memberId(member.getId())
                .userId(member.getUser().getId())
                .fullName(member.getUser().getFullName())
                .email(member.getUser().getEmail())
                .role(member.getUser().getRole().name())
                .isLead(member.getIsLead())
                .joinedAt(member.getJoinedAt())
                .build();
    }
}
