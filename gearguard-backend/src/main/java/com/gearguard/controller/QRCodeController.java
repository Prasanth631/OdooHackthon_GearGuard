package com.gearguard.controller;

import com.gearguard.model.Equipment;
import com.gearguard.repository.EquipmentRepository;
import com.gearguard.service.QRCodeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/qrcode")
@CrossOrigin(origins = "*")
@Tag(name = "QR Code", description = "QR code generation for equipment")
public class QRCodeController {

    @Autowired
    private QRCodeService qrCodeService;

    @Autowired
    private EquipmentRepository equipmentRepository;

    @GetMapping("/equipment/{id}")
    @Operation(summary = "Generate QR code for equipment", description = "Creates a QR code PNG image for the specified equipment")
    public ResponseEntity<byte[]> generateEquipmentQRCode(
            @PathVariable Long id,
            @RequestParam(defaultValue = "300") int size) {

        Equipment equipment = equipmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Equipment not found"));

        byte[] qrCode = qrCodeService.generateEquipmentQRCodeWithDetails(
                id, equipment.getName(), equipment.getSerialNumber(), size, size);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"equipment_" + id + "_qr.png\"")
                .contentType(MediaType.IMAGE_PNG)
                .body(qrCode);
    }

    @GetMapping("/equipment/{id}/download")
    @Operation(summary = "Download QR code as file")
    public ResponseEntity<byte[]> downloadEquipmentQRCode(
            @PathVariable Long id,
            @RequestParam(defaultValue = "300") int size) {

        Equipment equipment = equipmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Equipment not found"));

        byte[] qrCode = qrCodeService.generateEquipmentQRCodeWithDetails(
                id, equipment.getName(), equipment.getSerialNumber(), size, size);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + equipment.getName() + "_qr.png\"")
                .contentType(MediaType.IMAGE_PNG)
                .body(qrCode);
    }
}
