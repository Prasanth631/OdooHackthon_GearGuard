package com.gearguard.service;

import com.gearguard.dto.NotificationDTO;
import com.gearguard.model.Notification;
import com.gearguard.model.User;
import com.gearguard.model.enums.NotificationType;
import com.gearguard.repository.NotificationRepository;
import com.gearguard.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailService emailService;

    public List<NotificationDTO> getUserNotifications(Long userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .limit(20)
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public List<NotificationDTO> getUnreadNotifications(Long userId) {
        return notificationRepository.findByUserIdAndIsReadFalseOrderByCreatedAtDesc(userId).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public long getUnreadCount(Long userId) {
        return notificationRepository.countByUserIdAndIsReadFalse(userId);
    }

    @Transactional
    public void markAsRead(Long notificationId) {
        notificationRepository.markAsRead(notificationId);
    }

    @Transactional
    public void markAllAsRead(Long userId) {
        notificationRepository.markAllAsRead(userId);
    }

    public void createNotification(Long userId, String title, String message, NotificationType type) {
        createNotification(userId, title, message, type, null, null, false);
    }

    public void createNotification(Long userId, String title, String message, NotificationType type,
            String relatedEntityType, Long relatedEntityId, boolean sendEmail) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null)
            return;

        Notification notification = Notification.builder()
                .user(user)
                .title(title)
                .message(message)
                .type(type)
                .relatedEntityType(relatedEntityType)
                .relatedEntityId(relatedEntityId)
                .build();

        notificationRepository.save(notification);

        // Send email for important notifications
        if (sendEmail) {
            try {
                emailService.sendNotificationEmail(user.getEmail(), title, message);
            } catch (Exception e) {
                System.err.println("Failed to send notification email: " + e.getMessage());
            }
        }
    }

    public void notifyRequestAssigned(Long userId, String requestSubject, Long requestId) {
        createNotification(userId,
                "New Request Assigned",
                "You have been assigned to: " + requestSubject,
                NotificationType.REQUEST_ASSIGNED,
                "MaintenanceRequest", requestId, true);
    }

    public void notifyRequestUpdated(Long userId, String requestSubject, String newStage, Long requestId) {
        createNotification(userId,
                "Request Updated",
                requestSubject + " has been moved to " + newStage,
                NotificationType.REQUEST_UPDATED,
                "MaintenanceRequest", requestId, false);
    }

    public void notifyRequestCompleted(Long userId, String requestSubject, Long requestId) {
        createNotification(userId,
                "Request Completed",
                requestSubject + " has been marked as completed!",
                NotificationType.REQUEST_COMPLETED,
                "MaintenanceRequest", requestId, true);
    }

    public void notifyOverdue(Long userId, String requestSubject, Long requestId) {
        createNotification(userId,
                "⚠️ Overdue Request",
                requestSubject + " is overdue and needs immediate attention!",
                NotificationType.REQUEST_OVERDUE,
                "MaintenanceRequest", requestId, true);
    }

    public void notifyTeamAdded(Long userId, String teamName) {
        createNotification(userId,
                "Added to Team",
                "You have been added to the " + teamName + " team",
                NotificationType.TEAM_ADDED,
                null, null, true);
    }

    private NotificationDTO toDTO(Notification notification) {
        return NotificationDTO.builder()
                .id(notification.getId())
                .title(notification.getTitle())
                .message(notification.getMessage())
                .type(notification.getType())
                .isRead(notification.getIsRead())
                .relatedEntityType(notification.getRelatedEntityType())
                .relatedEntityId(notification.getRelatedEntityId())
                .createdAt(notification.getCreatedAt())
                .timeAgo(getTimeAgo(notification.getCreatedAt()))
                .build();
    }

    private String getTimeAgo(LocalDateTime dateTime) {
        if (dateTime == null)
            return "Recently";
        long minutes = ChronoUnit.MINUTES.between(dateTime, LocalDateTime.now());
        if (minutes < 1)
            return "Just now";
        if (minutes < 60)
            return minutes + "m ago";
        long hours = ChronoUnit.HOURS.between(dateTime, LocalDateTime.now());
        if (hours < 24)
            return hours + "h ago";
        long days = ChronoUnit.DAYS.between(dateTime, LocalDateTime.now());
        return days + "d ago";
    }
}
