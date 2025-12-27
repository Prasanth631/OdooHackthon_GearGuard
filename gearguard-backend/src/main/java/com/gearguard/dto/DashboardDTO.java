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
public class DashboardDTO {

    // Summary stats
    private long totalEquipment;
    private long activeRequests;
    private long completedToday;
    private long overdueRequests;

    // Breakdowns
    private List<TeamRequestCount> requestsByTeam;
    private List<StatusCount> requestsByStatus;
    private List<CategoryCount> equipmentByCategory;
    private List<RecentActivity> recentActivity;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TeamRequestCount {
        private String name;
        private long requests;
        private String color;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class StatusCount {
        private String name;
        private long value;
        private String color;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CategoryCount {
        private String name;
        private long count;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RecentActivity {
        private Long id;
        private String message;
        private String time;
        private String type;
    }
}
