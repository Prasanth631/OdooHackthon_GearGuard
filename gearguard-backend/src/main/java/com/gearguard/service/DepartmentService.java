package com.gearguard.service;

import com.gearguard.dto.CreateDepartmentRequest;
import com.gearguard.dto.DepartmentDTO;
import com.gearguard.model.Department;
import com.gearguard.repository.DepartmentRepository;
import com.gearguard.repository.EquipmentRepository;
import com.gearguard.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DepartmentService {

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EquipmentRepository equipmentRepository;

    public List<DepartmentDTO> getAllDepartments() {
        return departmentRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public DepartmentDTO getDepartmentById(Long id) {
        Department department = departmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Department not found"));
        return toDTO(department);
    }

    public DepartmentDTO createDepartment(CreateDepartmentRequest request) {
        if (departmentRepository.existsByName(request.getName())) {
            throw new RuntimeException("Department with this name already exists");
        }

        Department department = Department.builder()
                .name(request.getName())
                .description(request.getDescription())
                .build();

        if (request.getManagerId() != null) {
            userRepository.findById(request.getManagerId())
                    .ifPresent(department::setManager);
        }

        Department saved = departmentRepository.save(department);
        return toDTO(saved);
    }

    public DepartmentDTO updateDepartment(Long id, CreateDepartmentRequest request) {
        Department department = departmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Department not found"));

        if (!department.getName().equals(request.getName()) &&
                departmentRepository.existsByName(request.getName())) {
            throw new RuntimeException("Department with this name already exists");
        }

        department.setName(request.getName());
        department.setDescription(request.getDescription());

        if (request.getManagerId() != null) {
            userRepository.findById(request.getManagerId())
                    .ifPresent(department::setManager);
        } else {
            department.setManager(null);
        }

        Department saved = departmentRepository.save(department);
        return toDTO(saved);
    }

    public void deleteDepartment(Long id) {
        if (!departmentRepository.existsById(id)) {
            throw new RuntimeException("Department not found");
        }
        departmentRepository.deleteById(id);
    }

    private DepartmentDTO toDTO(Department department) {
        int equipmentCount = equipmentRepository.findByDepartmentId(department.getId()).size();

        return DepartmentDTO.builder()
                .id(department.getId())
                .name(department.getName())
                .description(department.getDescription())
                .managerName(department.getManager() != null ? department.getManager().getFullName() : null)
                .managerId(department.getManager() != null ? department.getManager().getId() : null)
                .equipmentCount(equipmentCount)
                .createdAt(department.getCreatedAt())
                .build();
    }
}
