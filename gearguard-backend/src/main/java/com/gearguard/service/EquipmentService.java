package com.gearguard.service;

import com.gearguard.dto.CreateEquipmentRequest;
import com.gearguard.dto.EquipmentDTO;
import com.gearguard.model.Equipment;
import com.gearguard.model.enums.EquipmentStatus;
import com.gearguard.repository.DepartmentRepository;
import com.gearguard.repository.EquipmentRepository;
import com.gearguard.repository.MaintenanceTeamRepository;
import com.gearguard.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class EquipmentService {

    @Autowired
    private EquipmentRepository equipmentRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MaintenanceTeamRepository maintenanceTeamRepository;

    @Autowired
    private AuditLogService auditLogService;

    public List<EquipmentDTO> getAllEquipment() {
        return equipmentRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public List<EquipmentDTO> getEquipmentByStatus(EquipmentStatus status) {
        return equipmentRepository.findByStatus(status).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public List<EquipmentDTO> getEquipmentByCategory(String category) {
        return equipmentRepository.findByCategory(category).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public EquipmentDTO getEquipmentById(Long id) {
        Equipment equipment = equipmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Equipment not found"));
        return toDTO(equipment);
    }

    public EquipmentDTO createEquipment(CreateEquipmentRequest request) {
        // Auto-generate serial number if not provided
        String serialNumber = request.getSerialNumber();
        if (serialNumber == null || serialNumber.trim().isEmpty()) {
            serialNumber = generateSerialNumber();
        } else if (equipmentRepository.existsBySerialNumber(serialNumber)) {
            throw new RuntimeException("Equipment with this serial number already exists");
        }

        Equipment equipment = Equipment.builder()
                .name(request.getName())
                .serialNumber(serialNumber)
                .category(request.getCategory())
                .purchaseDate(request.getPurchaseDate())
                .warrantyExpiry(request.getWarrantyExpiry())
                .location(request.getLocation())
                .status(request.getStatus() != null ? request.getStatus() : EquipmentStatus.ACTIVE)
                .healthScore(request.getHealthScore() != null ? request.getHealthScore() : 100)
                .notes(request.getNotes())
                .build();

        if (request.getDepartmentId() != null) {
            departmentRepository.findById(request.getDepartmentId())
                    .ifPresent(equipment::setDepartment);
        }

        if (request.getAssignedToId() != null) {
            userRepository.findById(request.getAssignedToId())
                    .ifPresent(equipment::setAssignedTo);
        }

        if (request.getMaintenanceTeamId() != null) {
            maintenanceTeamRepository.findById(request.getMaintenanceTeamId())
                    .ifPresent(equipment::setMaintenanceTeam);
        }

        if (request.getDefaultTechnicianId() != null) {
            userRepository.findById(request.getDefaultTechnicianId())
                    .ifPresent(equipment::setDefaultTechnician);
        }

        Equipment saved = equipmentRepository.save(equipment);

        // Log the creation
        auditLogService.log("CREATE", "Equipment", saved.getId(),
                "Created equipment: " + saved.getName() + " (S/N: " + saved.getSerialNumber() + ")");

        return toDTO(saved);
    }

    public EquipmentDTO updateEquipment(Long id, CreateEquipmentRequest request) {
        Equipment equipment = equipmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Equipment not found"));

        if (!equipment.getSerialNumber().equals(request.getSerialNumber()) &&
                equipmentRepository.existsBySerialNumber(request.getSerialNumber())) {
            throw new RuntimeException("Equipment with this serial number already exists");
        }

        equipment.setName(request.getName());
        equipment.setSerialNumber(request.getSerialNumber());
        equipment.setCategory(request.getCategory());
        equipment.setPurchaseDate(request.getPurchaseDate());
        equipment.setWarrantyExpiry(request.getWarrantyExpiry());
        equipment.setLocation(request.getLocation());
        equipment.setNotes(request.getNotes());

        if (request.getStatus() != null) {
            equipment.setStatus(request.getStatus());
        }

        if (request.getHealthScore() != null) {
            equipment.setHealthScore(request.getHealthScore());
        }

        if (request.getDepartmentId() != null) {
            departmentRepository.findById(request.getDepartmentId())
                    .ifPresent(equipment::setDepartment);
        } else {
            equipment.setDepartment(null);
        }

        if (request.getAssignedToId() != null) {
            userRepository.findById(request.getAssignedToId())
                    .ifPresent(equipment::setAssignedTo);
        } else {
            equipment.setAssignedTo(null);
        }

        if (request.getMaintenanceTeamId() != null) {
            maintenanceTeamRepository.findById(request.getMaintenanceTeamId())
                    .ifPresent(equipment::setMaintenanceTeam);
        } else {
            equipment.setMaintenanceTeam(null);
        }

        Equipment saved = equipmentRepository.save(equipment);

        // Log the update
        auditLogService.log("UPDATE", "Equipment", saved.getId(),
                "Updated equipment: " + saved.getName());

        return toDTO(saved);
    }

    public void deleteEquipment(Long id) {
        Equipment equipment = equipmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Equipment not found"));

        String equipmentName = equipment.getName();
        equipmentRepository.deleteById(id);

        // Log the deletion
        auditLogService.log("DELETE", "Equipment", id,
                "Deleted equipment: " + equipmentName);
    }

    public List<String> getCategories() {
        return Arrays.asList("Machinery", "IT Equipment", "Vehicles", "Office Equipment", "HVAC", "Electrical",
                "Plumbing", "Other");
    }

    public List<String> getStatuses() {
        return Arrays.stream(EquipmentStatus.values())
                .map(Enum::name)
                .collect(Collectors.toList());
    }

    /**
     * Generates a unique serial number in format: EQ-YYYYMMDD-XXXXX
     */
    private String generateSerialNumber() {
        String dateStr = LocalDate.now().format(DateTimeFormatter.BASIC_ISO_DATE);
        String randomStr = UUID.randomUUID().toString().substring(0, 5).toUpperCase();
        String serialNumber = "EQ-" + dateStr + "-" + randomStr;

        // Ensure uniqueness
        while (equipmentRepository.existsBySerialNumber(serialNumber)) {
            randomStr = UUID.randomUUID().toString().substring(0, 5).toUpperCase();
            serialNumber = "EQ-" + dateStr + "-" + randomStr;
        }

        return serialNumber;
    }

    private EquipmentDTO toDTO(Equipment equipment) {
        return EquipmentDTO.builder()
                .id(equipment.getId())
                .name(equipment.getName())
                .serialNumber(equipment.getSerialNumber())
                .category(equipment.getCategory())
                .department(equipment.getDepartment() != null ? equipment.getDepartment().getName() : null)
                .departmentId(equipment.getDepartment() != null ? equipment.getDepartment().getId() : null)
                .assignedTo(equipment.getAssignedTo() != null ? equipment.getAssignedTo().getFullName() : null)
                .assignedToId(equipment.getAssignedTo() != null ? equipment.getAssignedTo().getId() : null)
                .maintenanceTeam(
                        equipment.getMaintenanceTeam() != null ? equipment.getMaintenanceTeam().getName() : null)
                .maintenanceTeamId(
                        equipment.getMaintenanceTeam() != null ? equipment.getMaintenanceTeam().getId() : null)
                .purchaseDate(equipment.getPurchaseDate())
                .warrantyExpiry(equipment.getWarrantyExpiry())
                .location(equipment.getLocation())
                .status(equipment.getStatus())
                .healthScore(equipment.getHealthScore())
                .notes(equipment.getNotes())
                .underWarranty(equipment.isUnderWarranty())
                .createdAt(equipment.getCreatedAt())
                .updatedAt(equipment.getUpdatedAt())
                .build();
    }
}
