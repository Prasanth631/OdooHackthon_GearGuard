package com.gearguard.controller;

import com.gearguard.model.Attachment;
import com.gearguard.service.AttachmentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/attachments")
@CrossOrigin(origins = "*")
@Tag(name = "Attachments", description = "File attachment management")
public class AttachmentController {

    @Autowired
    private AttachmentService attachmentService;

    @PostMapping("/upload")
    @Operation(summary = "Upload a file", description = "Upload a file and attach it to an entity")
    public ResponseEntity<?> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam("entityType") String entityType,
            @RequestParam("entityId") Long entityId) {
        try {
            Attachment attachment = attachmentService.uploadFile(file, entityType, entityId);
            Map<String, Object> response = new HashMap<>();
            response.put("id", attachment.getId());
            response.put("filename", attachment.getOriginalFilename());
            response.put("size", attachment.getFileSize());
            response.put("message", "File uploaded successfully");
            return ResponseEntity.ok(response);
        } catch (IOException e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Failed to upload file: " + e.getMessage()));
        }
    }

    @GetMapping("/{id}/download")
    @Operation(summary = "Download a file")
    public ResponseEntity<byte[]> downloadFile(@PathVariable Long id) {
        try {
            Attachment attachment = attachmentService.getAttachment(id);
            byte[] data = attachmentService.downloadFile(id);

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION,
                            "attachment; filename=\"" + attachment.getOriginalFilename() + "\"")
                    .contentType(
                            MediaType.parseMediaType(attachment.getContentType() != null ? attachment.getContentType()
                                    : "application/octet-stream"))
                    .body(data);
        } catch (IOException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping
    @Operation(summary = "Get attachments for an entity")
    public ResponseEntity<List<Attachment>> getAttachments(
            @RequestParam String entityType,
            @RequestParam Long entityId) {
        return ResponseEntity.ok(attachmentService.getAttachments(entityType, entityId));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete an attachment")
    public ResponseEntity<?> deleteAttachment(@PathVariable Long id) {
        try {
            attachmentService.deleteAttachment(id);
            return ResponseEntity.ok(Map.of("message", "Attachment deleted successfully"));
        } catch (IOException e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Failed to delete attachment: " + e.getMessage()));
        }
    }
}
