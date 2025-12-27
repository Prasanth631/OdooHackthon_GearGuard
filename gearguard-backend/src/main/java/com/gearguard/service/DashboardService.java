package com.gearguard.service;

import com.gearguard.dto.DashboardDTO;
import com.gearguard.model.MaintenanceRequest;
import com.gearguard.model.MaintenanceTeam;
import com.gearguard.model.enums.RequestStage;
import com.gearguard.repository.EquipmentRepository;
import com.gearguard.repository.MaintenanceRequestRepository;
import com.gearguard.repository.MaintenanceTeamRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    @Autowired
    private MaintenanceRequestRepository requestRepository;

    @Autowired
    private EquipmentRepository equipmentRepository;

    @Autowired
    private MaintenanceTeamRepository teamRepository;

    public DashboardDTO getDashboardStats() {
        // Summary stats
        long totalEquipment = equipmentRepository.count();
        long activeRequests = requestRepository.countByStage(RequestStage.NEW) +
                requestRepository.countByStage(RequestStage.IN_PROGRESS);
        long overdueRequests = requestRepository.countByIsOverdueTrue();
        long completedToday = requestRepository.countCompletedToday(LocalDate.now().atStartOfDay());

        // Requests by team
        List<DashboardDTO.TeamRequestCount> requestsByTeam = new ArrayList<>();
        List<MaintenanceTeam> teams = teamRepository.findAll();
        for (MaintenanceTeam team : teams) {
            long count = requestRepository.countByAssignedTeamIdAndStageNot(team.getId(), RequestStage.REPAIRED) +
                    requestRepository.countByAssignedTeamIdAndStageNot(team.getId(), RequestStage.SCRAP);
            // Actually get total requests for this team
            long totalTeamRequests = requestRepository.findByAssignedTeamId(team.getId()).size();
            requestsByTeam.add(DashboardDTO.TeamRequestCount.builder()
                    .name(team.getName())
                    .requests(totalTeamRequests)
                    .color(team.getColor())
                    .build());
        }

        // Requests by status
        List<DashboardDTO.StatusCount> requestsByStatus = Arrays.asList(
                DashboardDTO.StatusCount.builder()
                        .name("New")
                        .value(requestRepository.countByStage(RequestStage.NEW))
                        .color("#6366f1")
                        .build(),
                DashboardDTO.StatusCount.builder()
                        .name("In Progress")
                        .value(requestRepository.countByStage(RequestStage.IN_PROGRESS))
                        .color("#f59e0b")
                        .build(),
                DashboardDTO.StatusCount.builder()
                        .name("Repaired")
                        .value(requestRepository.countByStage(RequestStage.REPAIRED))
                        .color("#10b981")
                        .build(),
                DashboardDTO.StatusCount.builder()
                        .name("Scrap")
                        .value(requestRepository.countByStage(RequestStage.SCRAP))
                        .color("#6b7280")
                        .build());

        // Equipment by category
        List<DashboardDTO.CategoryCount> equipmentByCategory = new ArrayList<>();
        List<Object[]> categoryCounts = requestRepository.countByCategory();
        for (Object[] row : categoryCounts) {
            equipmentByCategory.add(DashboardDTO.CategoryCount.builder()
                    .name(row[0] != null ? row[0].toString() : "Uncategorized")
                    .count((Long) row[1])
                    .build());
        }

        // Recent activity (last 10 requests)
        List<DashboardDTO.RecentActivity> recentActivity = new ArrayList<>();
        List<MaintenanceRequest> recentRequests = requestRepository.findAllForKanban();
        int count = 0;
        for (MaintenanceRequest req : recentRequests) {
            if (count >= 5)
                break;
            String type = "new";
            String message = req.getSubject();

            if (req.getStage() == RequestStage.REPAIRED) {
                type = "success";
                message = req.getSubject() + " marked as repaired";
            } else if (req.getIsOverdue()) {
                type = "overdue";
                message = "Overdue: " + req.getSubject();
            } else if (req.getScheduledDate() != null && req.getScheduledDate().isAfter(LocalDate.now())) {
                type = "scheduled";
                message = req.getSubject() + " scheduled";
            }

            String timeAgo = getTimeAgo(req.getCreatedAt());

            recentActivity.add(DashboardDTO.RecentActivity.builder()
                    .id(req.getId())
                    .message(message)
                    .time(timeAgo)
                    .type(type)
                    .build());
            count++;
        }

        return DashboardDTO.builder()
                .totalEquipment(totalEquipment)
                .activeRequests(activeRequests)
                .completedToday(completedToday)
                .overdueRequests(overdueRequests)
                .requestsByTeam(requestsByTeam)
                .requestsByStatus(requestsByStatus)
                .equipmentByCategory(equipmentByCategory)
                .recentActivity(recentActivity)
                .build();
    }

    private String getTimeAgo(LocalDateTime dateTime) {
        if (dateTime == null)
            return "Recently";

        long minutes = ChronoUnit.MINUTES.between(dateTime, LocalDateTime.now());
        if (minutes < 1)
            return "Just now";
        if (minutes < 60)
            return minutes + " min ago";

        long hours = ChronoUnit.HOURS.between(dateTime, LocalDateTime.now());
        if (hours < 24)
            return hours + " hour" + (hours > 1 ? "s" : "") + " ago";

        long days = ChronoUnit.DAYS.between(dateTime, LocalDateTime.now());
        if (days < 7)
            return days + " day" + (days > 1 ? "s" : "") + " ago";

        return dateTime.format(DateTimeFormatter.ofPattern("MMM d"));
    }
}
