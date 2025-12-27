package com.gearguard.service;

import com.gearguard.model.Attachment;
import com.gearguard.model.User;
import com.gearguard.repository.AttachmentRepository;
import com.gearguard.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

@Service
public class AttachmentService {

    @Value("${app.upload.dir:uploads}")
    private String uploadDir;

    @Autowired
    private AttachmentRepository attachmentRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AuditLogService auditLogService;

    public Attachment uploadFile(MultipartFile file, String entityType, Long entityId) throws IOException {
        // Create upload directory if not exists
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        // Generate unique filename
        String originalFilename = file.getOriginalFilename();
        String extension = originalFilename != null && originalFilename.contains(".")
                ? originalFilename.substring(originalFilename.lastIndexOf("."))
                : "";
        String filename = UUID.randomUUID().toString() + extension;

        // Save file
        Path filePath = uploadPath.resolve(filename);
        Files.copy(file.getInputStream(), filePath);

        // Save attachment record
        User user = getCurrentUser();
        Attachment attachment = Attachment.builder()
                .filename(filename)
                .originalFilename(originalFilename)
                .contentType(file.getContentType())
                .fileSize(file.getSize())
                .entityType(entityType)
                .entityId(entityId)
                .uploadedBy(user)
                .build();

        attachment = attachmentRepository.save(attachment);

        // Log the upload
        auditLogService.log("UPLOAD", entityType, entityId, "Uploaded file: " + originalFilename);

        return attachment;
    }

    public byte[] downloadFile(Long attachmentId) throws IOException {
        Attachment attachment = attachmentRepository.findById(attachmentId)
                .orElseThrow(() -> new RuntimeException("Attachment not found"));

        Path filePath = Paths.get(uploadDir).resolve(attachment.getFilename());
        return Files.readAllBytes(filePath);
    }

    public Attachment getAttachment(Long attachmentId) {
        return attachmentRepository.findById(attachmentId)
                .orElseThrow(() -> new RuntimeException("Attachment not found"));
    }

    public List<Attachment> getAttachments(String entityType, Long entityId) {
        return attachmentRepository.findByEntityTypeAndEntityIdOrderByCreatedAtDesc(entityType, entityId);
    }

    public void deleteAttachment(Long attachmentId) throws IOException {
        Attachment attachment = attachmentRepository.findById(attachmentId)
                .orElseThrow(() -> new RuntimeException("Attachment not found"));

        // Delete file
        Path filePath = Paths.get(uploadDir).resolve(attachment.getFilename());
        Files.deleteIfExists(filePath);

        // Delete record
        attachmentRepository.delete(attachment);

        // Log deletion
        auditLogService.log("DELETE", attachment.getEntityType(), attachment.getEntityId(),
                "Deleted file: " + attachment.getOriginalFilename());
    }

    private User getCurrentUser() {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth != null) {
                return userRepository.findByEmail(auth.getName()).orElse(null);
            }
        } catch (Exception e) {
            // Ignore
        }
        return null;
    }
}
