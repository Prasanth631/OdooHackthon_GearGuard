package com.gearguard.repository;

import com.gearguard.model.Equipment;
import com.gearguard.model.enums.EquipmentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EquipmentRepository extends JpaRepository<Equipment, Long> {

    Optional<Equipment> findBySerialNumber(String serialNumber);

    List<Equipment> findByDepartmentId(Long departmentId);

    List<Equipment> findByAssignedToId(Long userId);

    List<Equipment> findByMaintenanceTeamId(Long teamId);

    List<Equipment> findByStatus(EquipmentStatus status);

    List<Equipment> findByCategory(String category);

    boolean existsBySerialNumber(String serialNumber);

    List<Equipment> findByNameContainingIgnoreCase(String name);

    @Query("SELECT e FROM Equipment e " +
            "LEFT JOIN FETCH e.department " +
            "LEFT JOIN FETCH e.assignedTo " +
            "LEFT JOIN FETCH e.maintenanceTeam " +
            "WHERE e.status != 'SCRAPPED'")
    List<Equipment> findAllActiveWithDetails();

    @Query("SELECT COUNT(r) FROM MaintenanceRequest r WHERE r.equipment.id = :equipmentId AND r.stage != 'REPAIRED'")
    Long countOpenRequestsByEquipmentId(@Param("equipmentId") Long equipmentId);
}
