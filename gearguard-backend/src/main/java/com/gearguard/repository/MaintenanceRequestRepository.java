package com.gearguard.repository;

import com.gearguard.model.MaintenanceRequest;
import com.gearguard.model.enums.RequestStage;
import com.gearguard.model.enums.RequestType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface MaintenanceRequestRepository extends JpaRepository<MaintenanceRequest, Long> {

        List<MaintenanceRequest> findByEquipmentId(Long equipmentId);

        List<MaintenanceRequest> findByStage(RequestStage stage);

        List<MaintenanceRequest> findByType(RequestType type);

        List<MaintenanceRequest> findByAssignedToId(Long userId);

        List<MaintenanceRequest> findByAssignedTeamId(Long teamId);

        List<MaintenanceRequest> findByIsOverdueTrue();

        List<MaintenanceRequest> findByScheduledDateBetween(LocalDate start, LocalDate end);

        @Query("SELECT r FROM MaintenanceRequest r " +
                        "LEFT JOIN FETCH r.equipment " +
                        "LEFT JOIN FETCH r.assignedTo " +
                        "LEFT JOIN FETCH r.assignedTeam " +
                        "ORDER BY r.stage, r.priority DESC, r.createdAt DESC")
        List<MaintenanceRequest> findAllForKanban();

        @Query("SELECT r FROM MaintenanceRequest r " +
                        "WHERE r.scheduledDate BETWEEN :start AND :end " +
                        "ORDER BY r.scheduledDate")
        List<MaintenanceRequest> findAllForCalendar(@Param("start") LocalDate start, @Param("end") LocalDate end);

        @Query("SELECT r.assignedTeam.name, COUNT(r) FROM MaintenanceRequest r " +
                        "WHERE r.assignedTeam IS NOT NULL " +
                        "GROUP BY r.assignedTeam.name")
        List<Object[]> countByTeam();

        @Query("SELECT r.equipment.category, COUNT(r) FROM MaintenanceRequest r " +
                        "WHERE r.equipment IS NOT NULL " +
                        "GROUP BY r.equipment.category")
        List<Object[]> countByCategory();

        @Query("SELECT r FROM MaintenanceRequest r " +
                        "WHERE r.isOverdue = true OR r.priority = 'CRITICAL' " +
                        "ORDER BY r.priority DESC, r.createdAt")
        List<MaintenanceRequest> findUrgentRequests();

        @Modifying
        @Query("UPDATE MaintenanceRequest r SET r.stage = :stage WHERE r.id = :id")
        void updateStage(@Param("id") Long id, @Param("stage") RequestStage stage);

        Long countByStage(RequestStage stage);

        Long countByIsOverdueTrue();

        @Query("SELECT COUNT(r) FROM MaintenanceRequest r WHERE r.completedAt IS NOT NULL AND r.completedAt >= :startOfDay")
        Long countCompletedToday(@Param("startOfDay") LocalDateTime startOfDay);
}
