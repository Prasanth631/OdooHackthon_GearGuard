package com.gearguard.service;

import com.gearguard.model.MaintenanceRequest;
import com.gearguard.model.User;
import com.gearguard.model.enums.Role;
import com.gearguard.repository.MaintenanceRequestRepository;
import com.gearguard.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import jakarta.mail.internet.MimeMessage;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class EmailNotificationService {

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MaintenanceRequestRepository requestRepository;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Value("${app.mail.sender-name:GearGuard Team}")
    private String senderName;

    @Value("${app.frontend.url:http://localhost:5173}")
    private String frontendUrl;

    /**
     * Send email when technician is assigned to a request
     */
    @Async
    public void sendAssignmentNotification(MaintenanceRequest request, User technician) {
        try {
            String subject = "🔧 New Assignment: " + request.getSubject();
            String htmlContent = buildAssignmentEmail(request, technician);
            sendHtmlEmail(technician.getEmail(), subject, htmlContent);
        } catch (Exception e) {
            System.err.println("Failed to send assignment email: " + e.getMessage());
        }
    }

    /**
     * Scheduled job: Check for overdue requests and alert managers (runs every
     * hour)
     */
    @Scheduled(cron = "0 0 * * * *") // Every hour
    public void checkAndAlertOverdueRequests() {
        List<MaintenanceRequest> overdueRequests = requestRepository.findByIsOverdueTrue();
        if (overdueRequests.isEmpty())
            return;

        List<User> managers = userRepository.findAll().stream()
                .filter(u -> u.getRole() == Role.ADMIN || u.getRole() == Role.MANAGER)
                .collect(Collectors.toList());

        for (User manager : managers) {
            try {
                String subject = "⚠️ Alert: " + overdueRequests.size() + " Overdue Maintenance Requests";
                String htmlContent = buildOverdueAlertEmail(overdueRequests, manager);
                sendHtmlEmail(manager.getEmail(), subject, htmlContent);
            } catch (Exception e) {
                System.err.println("Failed to send overdue alert to " + manager.getEmail() + ": " + e.getMessage());
            }
        }
    }

    /**
     * Scheduled job: Daily digest of pending work (runs at 8 AM every day)
     */
    @Scheduled(cron = "0 0 8 * * *") // 8 AM daily
    public void sendDailyDigest() {
        List<MaintenanceRequest> pendingRequests = requestRepository.findAll().stream()
                .filter(r -> r.getStage().name().equals("NEW") || r.getStage().name().equals("IN_PROGRESS"))
                .collect(Collectors.toList());

        if (pendingRequests.isEmpty())
            return;

        // Send to managers
        List<User> managers = userRepository.findAll().stream()
                .filter(u -> u.getRole() == Role.ADMIN || u.getRole() == Role.MANAGER)
                .collect(Collectors.toList());

        for (User manager : managers) {
            try {
                String subject = "📋 Daily Digest: " + pendingRequests.size() + " Pending Maintenance Requests";
                String htmlContent = buildDailyDigestEmail(pendingRequests, manager);
                sendHtmlEmail(manager.getEmail(), subject, htmlContent);
            } catch (Exception e) {
                System.err.println("Failed to send daily digest to " + manager.getEmail() + ": " + e.getMessage());
            }
        }

        // Send to each technician their assigned tasks
        List<User> technicians = userRepository.findAll().stream()
                .filter(u -> u.getRole() == Role.TECHNICIAN)
                .collect(Collectors.toList());

        for (User tech : technicians) {
            List<MaintenanceRequest> techRequests = pendingRequests.stream()
                    .filter(r -> r.getAssignedTo() != null && r.getAssignedTo().getId().equals(tech.getId()))
                    .collect(Collectors.toList());

            if (!techRequests.isEmpty()) {
                try {
                    String subject = "📋 Your Daily Tasks: " + techRequests.size() + " Pending Requests";
                    String htmlContent = buildTechnicianDigestEmail(techRequests, tech);
                    sendHtmlEmail(tech.getEmail(), subject, htmlContent);
                } catch (Exception e) {
                    System.err.println("Failed to send digest to " + tech.getEmail() + ": " + e.getMessage());
                }
            }
        }
    }

    private void sendHtmlEmail(String to, String subject, String htmlContent) throws Exception {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
        helper.setFrom(fromEmail, senderName);
        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(htmlContent, true);
        mailSender.send(message);
    }

    private String buildAssignmentEmail(MaintenanceRequest request, User technician) {
        return """
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: 'Segoe UI', Arial, sans-serif; background-color: #f5f5f5; margin: 0; padding: 20px; }
                        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
                        .header { background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 30px; text-align: center; }
                        .header h1 { margin: 0; font-size: 24px; }
                        .content { padding: 30px; }
                        .badge { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; }
                        .badge-priority { background: #fee2e2; color: #dc2626; }
                        .badge-type { background: #e0e7ff; color: #4f46e5; }
                        .details { background: #f8fafc; border-radius: 8px; padding: 20px; margin: 20px 0; }
                        .details-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e2e8f0; }
                        .details-row:last-child { border-bottom: none; }
                        .btn { display: inline-block; background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 12px 30px; border-radius: 8px; text-decoration: none; font-weight: 600; }
                        .footer { background: #f8fafc; padding: 20px; text-align: center; color: #64748b; font-size: 12px; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>🔧 New Assignment</h1>
                        </div>
                        <div class="content">
                            <p>Hi <strong>%s</strong>,</p>
                            <p>You have been assigned to a new maintenance request:</p>

                            <h2 style="color: #1e293b;">%s</h2>

                            <div style="margin: 15px 0;">
                                <span class="badge badge-priority">%s</span>
                                <span class="badge badge-type">%s</span>
                            </div>

                            <div class="details">
                                <div class="details-row">
                                    <span>Equipment</span>
                                    <strong>%s</strong>
                                </div>
                                <div class="details-row">
                                    <span>Location</span>
                                    <strong>%s</strong>
                                </div>
                                <div class="details-row">
                                    <span>Scheduled Date</span>
                                    <strong>%s</strong>
                                </div>
                            </div>

                            <p style="color: #64748b;">%s</p>

                            <div style="text-align: center; margin-top: 30px;">
                                <a href="%s" class="btn">View Request</a>
                            </div>
                        </div>
                        <div class="footer">
                            <p>GearGuard Maintenance Tracker</p>
                        </div>
                    </div>
                </body>
                </html>
                """
                .formatted(
                        technician.getFullName(),
                        request.getSubject(),
                        request.getPriority().name(),
                        request.getType().name(),
                        request.getEquipment() != null ? request.getEquipment().getName() : "N/A",
                        request.getEquipment() != null ? request.getEquipment().getLocation() : "N/A",
                        request.getScheduledDate() != null ? request.getScheduledDate().toString() : "Not scheduled",
                        request.getDescription() != null ? request.getDescription() : "",
                        frontendUrl + "/technician/requests");
    }

    private String buildOverdueAlertEmail(List<MaintenanceRequest> requests, User manager) {
        StringBuilder requestsHtml = new StringBuilder();
        for (MaintenanceRequest r : requests.stream().limit(10).collect(Collectors.toList())) {
            requestsHtml.append(String.format(
                    """
                            <tr>
                                <td style="padding: 12px; border-bottom: 1px solid #e2e8f0;">%s</td>
                                <td style="padding: 12px; border-bottom: 1px solid #e2e8f0;">%s</td>
                                <td style="padding: 12px; border-bottom: 1px solid #e2e8f0;"><span style="color: #dc2626; font-weight: 600;">%s</span></td>
                                <td style="padding: 12px; border-bottom: 1px solid #e2e8f0;">%s</td>
                            </tr>
                            """,
                    r.getSubject(),
                    r.getEquipment() != null ? r.getEquipment().getName() : "N/A",
                    r.getPriority().name(),
                    r.getAssignedTo() != null ? r.getAssignedTo().getFullName() : "Unassigned"));
        }

        return """
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: 'Segoe UI', Arial, sans-serif; background-color: #f5f5f5; margin: 0; padding: 20px; }
                        .container { max-width: 700px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
                        .header { background: linear-gradient(135deg, #dc2626, #b91c1c); color: white; padding: 30px; text-align: center; }
                        .content { padding: 30px; }
                        table { width: 100%%; border-collapse: collapse; }
                        th { background: #f8fafc; padding: 12px; text-align: left; font-weight: 600; color: #475569; }
                        .btn { display: inline-block; background: #dc2626; color: white; padding: 12px 30px; border-radius: 8px; text-decoration: none; font-weight: 600; }
                        .footer { background: #f8fafc; padding: 20px; text-align: center; color: #64748b; font-size: 12px; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>⚠️ Overdue Requests Alert</h1>
                        </div>
                        <div class="content">
                            <p>Hi <strong>%s</strong>,</p>
                            <p>The following <strong>%d</strong> maintenance requests are overdue and require immediate attention:</p>

                            <table style="margin: 20px 0;">
                                <thead>
                                    <tr>
                                        <th>Subject</th>
                                        <th>Equipment</th>
                                        <th>Priority</th>
                                        <th>Assigned To</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    %s
                                </tbody>
                            </table>

                            <div style="text-align: center; margin-top: 30px;">
                                <a href="%s" class="btn">View All Requests</a>
                            </div>
                        </div>
                        <div class="footer">
                            <p>GearGuard Maintenance Tracker</p>
                        </div>
                    </div>
                </body>
                </html>
                """
                .formatted(
                        manager.getFullName(),
                        requests.size(),
                        requestsHtml.toString(),
                        frontendUrl + "/admin/requests");
    }

    private String buildDailyDigestEmail(List<MaintenanceRequest> requests, User manager) {
        long newCount = requests.stream().filter(r -> r.getStage().name().equals("NEW")).count();
        long inProgressCount = requests.stream().filter(r -> r.getStage().name().equals("IN_PROGRESS")).count();
        long overdueCount = requests.stream().filter(MaintenanceRequest::getIsOverdue).count();

        return """
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: 'Segoe UI', Arial, sans-serif; background-color: #f5f5f5; margin: 0; padding: 20px; }
                        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
                        .header { background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 30px; text-align: center; }
                        .content { padding: 30px; }
                        .stat-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin: 20px 0; }
                        .stat-card { background: linear-gradient(135deg, #f8fafc, #f1f5f9); border-radius: 12px; padding: 20px; text-align: center; }
                        .stat-value { font-size: 32px; font-weight: 700; color: #1e293b; }
                        .stat-label { font-size: 12px; color: #64748b; text-transform: uppercase; letter-spacing: 1px; }
                        .stat-card.danger { background: linear-gradient(135deg, #fef2f2, #fee2e2); }
                        .stat-card.danger .stat-value { color: #dc2626; }
                        .btn { display: inline-block; background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 12px 30px; border-radius: 8px; text-decoration: none; font-weight: 600; }
                        .footer { background: #f8fafc; padding: 20px; text-align: center; color: #64748b; font-size: 12px; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>📋 Daily Digest</h1>
                            <p style="margin: 0; opacity: 0.9;">%s</p>
                        </div>
                        <div class="content">
                            <p>Good morning <strong>%s</strong>,</p>
                            <p>Here's your maintenance summary for today:</p>

                            <div class="stat-grid">
                                <div class="stat-card">
                                    <div class="stat-value">%d</div>
                                    <div class="stat-label">New</div>
                                </div>
                                <div class="stat-card">
                                    <div class="stat-value">%d</div>
                                    <div class="stat-label">In Progress</div>
                                </div>
                                <div class="stat-card danger">
                                    <div class="stat-value">%d</div>
                                    <div class="stat-label">Overdue</div>
                                </div>
                            </div>

                            <div style="text-align: center; margin-top: 30px;">
                                <a href="%s" class="btn">Open Dashboard</a>
                            </div>
                        </div>
                        <div class="footer">
                            <p>GearGuard Maintenance Tracker</p>
                        </div>
                    </div>
                </body>
                </html>
                """
                .formatted(
                        LocalDate.now().toString(),
                        manager.getFullName(),
                        newCount,
                        inProgressCount,
                        overdueCount,
                        frontendUrl + "/admin/dashboard");
    }

    private String buildTechnicianDigestEmail(List<MaintenanceRequest> requests, User tech) {
        StringBuilder requestsHtml = new StringBuilder();
        for (MaintenanceRequest r : requests) {
            String priorityColor = switch (r.getPriority().name()) {
                case "CRITICAL" -> "#dc2626";
                case "HIGH" -> "#f59e0b";
                default -> "#3b82f6";
            };
            requestsHtml.append(String.format(
                    """
                            <div style="background: #f8fafc; border-radius: 8px; padding: 15px; margin-bottom: 10px; border-left: 4px solid %s;">
                                <strong>%s</strong><br>
                                <span style="color: #64748b; font-size: 14px;">%s • %s</span>
                            </div>
                            """,
                    priorityColor,
                    r.getSubject(),
                    r.getEquipment() != null ? r.getEquipment().getName() : "N/A",
                    r.getPriority().name()));
        }

        return """
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: 'Segoe UI', Arial, sans-serif; background-color: #f5f5f5; margin: 0; padding: 20px; }
                        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
                        .header { background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 30px; text-align: center; }
                        .content { padding: 30px; }
                        .btn { display: inline-block; background: #10b981; color: white; padding: 12px 30px; border-radius: 8px; text-decoration: none; font-weight: 600; }
                        .footer { background: #f8fafc; padding: 20px; text-align: center; color: #64748b; font-size: 12px; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>🔧 Your Tasks Today</h1>
                        </div>
                        <div class="content">
                            <p>Hi <strong>%s</strong>,</p>
                            <p>You have <strong>%d</strong> pending maintenance requests:</p>

                            %s

                            <div style="text-align: center; margin-top: 30px;">
                                <a href="%s" class="btn">View My Tasks</a>
                            </div>
                        </div>
                        <div class="footer">
                            <p>GearGuard Maintenance Tracker</p>
                        </div>
                    </div>
                </body>
                </html>
                """
                .formatted(
                        tech.getFullName(),
                        requests.size(),
                        requestsHtml.toString(),
                        frontendUrl + "/technician/requests");
    }
}
