package com.gearguard.service;

import com.gearguard.dto.CreateRequestDTO;
import com.gearguard.dto.MaintenanceRequestDTO;
import com.gearguard.model.Equipment;
import com.gearguard.model.MaintenanceRequest;
import com.gearguard.model.MaintenanceTeam;
import com.gearguard.model.User;
import com.gearguard.model.enums.RequestStage;
import com.gearguard.repository.EquipmentRepository;
import com.gearguard.repository.MaintenanceRequestRepository;
import com.gearguard.repository.MaintenanceTeamRepository;
import com.gearguard.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class MaintenanceRequestService {

        @Autowired
        private MaintenanceRequestRepository requestRepository;

        @Autowired
        private EquipmentRepository equipmentRepository;

        @Autowired
        private MaintenanceTeamRepository teamRepository;

        @Autowired
        private UserRepository userRepository;

        @Autowired
        private AuditLogService auditLogService;

        @Autowired
        private EmailNotificationService emailNotificationService;

        public List<MaintenanceRequestDTO> getAllRequests() {
                return requestRepository.findAllForKanban().stream()
                                .map(this::toDTO)
                                .collect(Collectors.toList());
        }

        public MaintenanceRequestDTO getRequestById(Long id) {
                MaintenanceRequest request = requestRepository.findById(id)
                                .orElseThrow(() -> new RuntimeException("Request not found"));
                return toDTO(request);
        }

        @Transactional
        public MaintenanceRequestDTO createRequest(CreateRequestDTO dto, Long requestedById) {
                Equipment equipment = equipmentRepository.findById(dto.getEquipmentId())
                                .orElseThrow(() -> new RuntimeException("Equipment not found"));

                User requestedBy = userRepository.findById(requestedById)
                                .orElseThrow(() -> new RuntimeException("User not found"));

                MaintenanceRequest request = MaintenanceRequest.builder()
                                .subject(dto.getSubject())
                                .description(dto.getDescription())
                                .equipment(equipment)
                                .type(dto.getType())
                                .priority(dto.getPriority())
                                .stage(RequestStage.NEW)
                                .scheduledDate(dto.getScheduledDate())
                                .estimatedDuration(dto.getEstimatedDuration())
                                .notes(dto.getNotes())
                                .requestedBy(requestedBy)
                                .build();

                if (dto.getAssignedTeamId() != null) {
                        MaintenanceTeam team = teamRepository.findById(dto.getAssignedTeamId())
                                        .orElseThrow(() -> new RuntimeException("Team not found"));
                        request.setAssignedTeam(team);
                }

                if (dto.getAssignedToId() != null) {
                        User assignee = userRepository.findById(dto.getAssignedToId())
                                        .orElseThrow(() -> new RuntimeException("Assignee not found"));
                        request.setAssignedTo(assignee);
                }

                requestRepository.save(request);

                // Log the creation
                auditLogService.log("CREATE", "Request", request.getId(),
                                "Created request: " + request.getSubject() + " (" + request.getPriority() + ")");

                return toDTO(request);
        }

        @Transactional
        public MaintenanceRequestDTO updateRequest(Long id, CreateRequestDTO dto) {
                MaintenanceRequest request = requestRepository.findById(id)
                                .orElseThrow(() -> new RuntimeException("Request not found"));

                request.setSubject(dto.getSubject());
                request.setDescription(dto.getDescription());
                request.setType(dto.getType());
                request.setPriority(dto.getPriority());
                request.setScheduledDate(dto.getScheduledDate());
                request.setEstimatedDuration(dto.getEstimatedDuration());
                request.setNotes(dto.getNotes());

                if (dto.getEquipmentId() != null) {
                        Equipment equipment = equipmentRepository.findById(dto.getEquipmentId())
                                        .orElseThrow(() -> new RuntimeException("Equipment not found"));
                        request.setEquipment(equipment);
                }

                if (dto.getAssignedTeamId() != null) {
                        MaintenanceTeam team = teamRepository.findById(dto.getAssignedTeamId())
                                        .orElseThrow(() -> new RuntimeException("Team not found"));
                        request.setAssignedTeam(team);
                } else {
                        request.setAssignedTeam(null);
                }

                if (dto.getAssignedToId() != null) {
                        User assignee = userRepository.findById(dto.getAssignedToId())
                                        .orElseThrow(() -> new RuntimeException("Assignee not found"));

                        // Check if this is a new assignment (different from current)
                        boolean isNewAssignment = request.getAssignedTo() == null ||
                                        !request.getAssignedTo().getId().equals(dto.getAssignedToId());

                        request.setAssignedTo(assignee);

                        // Send email notification if newly assigned
                        if (isNewAssignment) {
                                emailNotificationService.sendAssignmentNotification(request, assignee);
                        }
                } else {
                        request.setAssignedTo(null);
                }

                requestRepository.save(request);

                // Log the update
                auditLogService.log("UPDATE", "Request", request.getId(),
                                "Updated request: " + request.getSubject());

                return toDTO(request);
        }

        @Transactional
        public MaintenanceRequestDTO updateStage(Long id, RequestStage newStage) {
                MaintenanceRequest request = requestRepository.findById(id)
                                .orElseThrow(() -> new RuntimeException("Request not found"));

                RequestStage oldStage = request.getStage();
                request.setStage(newStage);

                // Mark completed if repaired or scrapped
                if (newStage == RequestStage.REPAIRED || newStage == RequestStage.SCRAP) {
                        request.setCompletedAt(LocalDateTime.now());
                        request.setIsOverdue(false);

                        // SCRAP LOGIC: Mark equipment as inactive when scrapped
                        if (newStage == RequestStage.SCRAP && request.getEquipment() != null) {
                                Equipment equipment = request.getEquipment();
                                equipment.setStatus(com.gearguard.model.enums.EquipmentStatus.INACTIVE);
                                equipment.setNotes((equipment.getNotes() != null ? equipment.getNotes() + "\n" : "")
                                                + "[SCRAPPED] " + LocalDateTime.now().toLocalDate() + " - Request #"
                                                + request.getId() + ": "
                                                + request.getSubject());
                                equipmentRepository.save(equipment);

                                // Log the scrap action
                                auditLogService.log("UPDATE", "Equipment", equipment.getId(),
                                                "Equipment marked as INACTIVE due to scrap - Request #"
                                                                + request.getId());
                        }
                } else {
                        request.setCompletedAt(null);
                        request.updateOverdueStatus();
                }

                requestRepository.save(request);

                // Log the stage change
                auditLogService.log("UPDATE", "Request", request.getId(),
                                "Stage changed: " + oldStage + " → " + newStage + " for: " + request.getSubject());

                return toDTO(request);
        }

        @Transactional
        public void deleteRequest(Long id) {
                MaintenanceRequest request = requestRepository.findById(id)
                                .orElseThrow(() -> new RuntimeException("Request not found"));

                String requestSubject = request.getSubject();
                requestRepository.delete(request);

                // Log the deletion
                auditLogService.log("DELETE", "Request", id, "Deleted request: " + requestSubject);
        }

        public List<MaintenanceRequestDTO> getRequestsByStage(RequestStage stage) {
                return requestRepository.findByStage(stage).stream()
                                .map(this::toDTO)
                                .collect(Collectors.toList());
        }

        public List<MaintenanceRequestDTO> getRequestsByTeam(Long teamId) {
                return requestRepository.findByAssignedTeamId(teamId).stream()
                                .map(this::toDTO)
                                .collect(Collectors.toList());
        }

        public List<MaintenanceRequestDTO> getOverdueRequests() {
                return requestRepository.findByIsOverdueTrue().stream()
                                .map(this::toDTO)
                                .collect(Collectors.toList());
        }

        private MaintenanceRequestDTO toDTO(MaintenanceRequest request) {
                return MaintenanceRequestDTO.builder()
                                .id(request.getId())
                                .subject(request.getSubject())
                                .description(request.getDescription())
                                .equipmentId(request.getEquipment() != null ? request.getEquipment().getId() : null)
                                .equipmentName(request.getEquipment() != null ? request.getEquipment().getName() : null)
                                .equipmentLocation(request.getEquipment() != null ? request.getEquipment().getLocation()
                                                : null)
                                .type(request.getType())
                                .stage(request.getStage())
                                .priority(request.getPriority())
                                .assignedTeamId(request.getAssignedTeam() != null ? request.getAssignedTeam().getId()
                                                : null)
                                .assignedTeamName(
                                                request.getAssignedTeam() != null ? request.getAssignedTeam().getName()
                                                                : null)
                                .assignedTeamColor(
                                                request.getAssignedTeam() != null ? request.getAssignedTeam().getColor()
                                                                : null)
                                .assignedToId(request.getAssignedTo() != null ? request.getAssignedTo().getId() : null)
                                .assignedToName(request.getAssignedTo() != null ? request.getAssignedTo().getFullName()
                                                : null)
                                .requestedById(request.getRequestedBy() != null ? request.getRequestedBy().getId()
                                                : null)
                                .requestedByName(request.getRequestedBy() != null
                                                ? request.getRequestedBy().getFullName()
                                                : null)
                                .scheduledDate(request.getScheduledDate())
                                .completedAt(request.getCompletedAt())
                                .estimatedDuration(request.getEstimatedDuration())
                                .isOverdue(request.getIsOverdue())
                                .notes(request.getNotes())
                                .createdAt(request.getCreatedAt())
                                .updatedAt(request.getUpdatedAt())
                                .build();
        }
}
