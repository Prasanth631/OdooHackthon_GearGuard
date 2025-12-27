package com.gearguard.repository;

import com.gearguard.model.MaintenanceTeam;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MaintenanceTeamRepository extends JpaRepository<MaintenanceTeam, Long> {

    Optional<MaintenanceTeam> findByName(String name);

    boolean existsByName(String name);

    @Query("SELECT DISTINCT t FROM MaintenanceTeam t LEFT JOIN FETCH t.members")
    List<MaintenanceTeam> findAllWithMembers();
}
