package com.gearguard.service;

import com.gearguard.model.Equipment;
import com.gearguard.model.MaintenanceRequest;
import com.gearguard.repository.EquipmentRepository;
import com.gearguard.repository.MaintenanceRequestRepository;
import com.lowagie.text.*;
import com.lowagie.text.Font;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class ReportService {

    @Autowired
    private EquipmentRepository equipmentRepository;

    @Autowired
    private MaintenanceRequestRepository requestRepository;

    // ==================== EQUIPMENT REPORTS ====================

    public byte[] generateEquipmentPdf() {
        List<Equipment> equipment = equipmentRepository.findAll();

        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Document document = new Document(PageSize.A4.rotate());
            PdfWriter.getInstance(document, out);
            document.open();

            // Title
            Font titleFont = new Font(Font.HELVETICA, 20, Font.BOLD, new Color(102, 126, 234));
            Paragraph title = new Paragraph("Equipment Inventory Report", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            title.setSpacingAfter(10);
            document.add(title);

            // Date
            Font dateFont = new Font(Font.HELVETICA, 10, Font.NORMAL, Color.GRAY);
            Paragraph date = new Paragraph(
                    "Generated on: " + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm")),
                    dateFont);
            date.setAlignment(Element.ALIGN_CENTER);
            date.setSpacingAfter(20);
            document.add(date);

            // Table
            PdfPTable table = new PdfPTable(6);
            table.setWidthPercentage(100);
            table.setWidths(new float[] { 1, 3, 2, 2, 2, 2 });

            // Header
            addPdfHeader(table, "ID", "Name", "Serial Number", "Location", "Category", "Status");

            // Data rows
            for (Equipment eq : equipment) {
                addPdfCell(table, String.valueOf(eq.getId()));
                addPdfCell(table, eq.getName());
                addPdfCell(table, eq.getSerialNumber());
                addPdfCell(table, eq.getLocation());
                addPdfCell(table, eq.getCategory());
                addPdfCell(table, eq.getStatus() != null ? eq.getStatus().name() : "N/A");
            }

            document.add(table);

            // Footer
            Paragraph footer = new Paragraph("\nTotal Equipment: " + equipment.size(),
                    new Font(Font.HELVETICA, 12, Font.BOLD));
            footer.setSpacingBefore(20);
            document.add(footer);

            document.close();
            return out.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate PDF: " + e.getMessage());
        }
    }

    public byte[] generateEquipmentExcel() {
        List<Equipment> equipment = equipmentRepository.findAll();

        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("Equipment Inventory");

            // Header style
            CellStyle headerStyle = workbook.createCellStyle();
            org.apache.poi.ss.usermodel.Font headerFont = workbook.createFont();
            headerFont.setBold(true);
            headerFont.setColor(IndexedColors.WHITE.getIndex());
            headerStyle.setFont(headerFont);
            headerStyle.setFillForegroundColor(IndexedColors.DARK_BLUE.getIndex());
            headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
            headerStyle.setBorderBottom(BorderStyle.THIN);

            // Header row
            Row headerRow = sheet.createRow(0);
            String[] headers = { "ID", "Name", "Serial Number", "Location", "Category", "Status", "Purchase Date" };
            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
                cell.setCellStyle(headerStyle);
            }

            // Data rows
            int rowNum = 1;
            for (Equipment eq : equipment) {
                Row row = sheet.createRow(rowNum++);
                row.createCell(0).setCellValue(eq.getId());
                row.createCell(1).setCellValue(eq.getName());
                row.createCell(2).setCellValue(eq.getSerialNumber() != null ? eq.getSerialNumber() : "");
                row.createCell(3).setCellValue(eq.getLocation() != null ? eq.getLocation() : "");
                row.createCell(4).setCellValue(eq.getCategory() != null ? eq.getCategory() : "");
                row.createCell(5).setCellValue(eq.getStatus() != null ? eq.getStatus().name() : "");
                row.createCell(6).setCellValue(eq.getPurchaseDate() != null ? eq.getPurchaseDate().toString() : "");
            }

            // Auto-size columns
            for (int i = 0; i < headers.length; i++) {
                sheet.autoSizeColumn(i);
            }

            workbook.write(out);
            return out.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate Excel: " + e.getMessage());
        }
    }

    // ==================== MAINTENANCE HISTORY REPORTS ====================

    public byte[] generateMaintenanceHistoryPdf() {
        List<MaintenanceRequest> requests = requestRepository.findAllForKanban();

        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Document document = new Document(PageSize.A4.rotate());
            PdfWriter.getInstance(document, out);
            document.open();

            // Title
            Font titleFont = new Font(Font.HELVETICA, 20, Font.BOLD, new Color(102, 126, 234));
            Paragraph title = new Paragraph("Maintenance History Report", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            title.setSpacingAfter(10);
            document.add(title);

            // Date
            Font dateFont = new Font(Font.HELVETICA, 10, Font.NORMAL, Color.GRAY);
            Paragraph date = new Paragraph(
                    "Generated on: " + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm")),
                    dateFont);
            date.setAlignment(Element.ALIGN_CENTER);
            date.setSpacingAfter(20);
            document.add(date);

            // Table
            PdfPTable table = new PdfPTable(7);
            table.setWidthPercentage(100);
            table.setWidths(new float[] { 1, 3, 2, 1.5f, 1.5f, 2, 2 });

            // Header
            addPdfHeader(table, "ID", "Subject", "Equipment", "Type", "Priority", "Status", "Scheduled");

            // Data rows
            for (MaintenanceRequest req : requests) {
                addPdfCell(table, String.valueOf(req.getId()));
                addPdfCell(table, req.getSubject());
                addPdfCell(table, req.getEquipment() != null ? req.getEquipment().getName() : "N/A");
                addPdfCell(table, req.getType() != null ? req.getType().name() : "N/A");
                addPdfCell(table, req.getPriority() != null ? req.getPriority().name() : "N/A");
                addPdfCell(table, req.getStage() != null ? req.getStage().name() : "N/A");
                addPdfCell(table, req.getScheduledDate() != null ? req.getScheduledDate().toString() : "-");
            }

            document.add(table);

            // Summary
            long completed = requests.stream()
                    .filter(r -> r.getStage() != null && r.getStage().name().equals("REPAIRED")).count();
            long inProgress = requests.stream()
                    .filter(r -> r.getStage() != null && r.getStage().name().equals("IN_PROGRESS")).count();
            long newReqs = requests.stream().filter(r -> r.getStage() != null && r.getStage().name().equals("NEW"))
                    .count();

            Paragraph summary = new Paragraph();
            summary.setSpacingBefore(20);
            summary.add(new Chunk("Summary:\n", new Font(Font.HELVETICA, 12, Font.BOLD)));
            summary.add(new Chunk("Total Requests: " + requests.size() + " | New: " + newReqs + " | In Progress: "
                    + inProgress + " | Completed: " + completed));
            document.add(summary);

            document.close();
            return out.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate PDF: " + e.getMessage());
        }
    }

    public byte[] generateMaintenanceHistoryExcel() {
        List<MaintenanceRequest> requests = requestRepository.findAllForKanban();

        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("Maintenance History");

            // Header style
            CellStyle headerStyle = workbook.createCellStyle();
            org.apache.poi.ss.usermodel.Font headerFont = workbook.createFont();
            headerFont.setBold(true);
            headerFont.setColor(IndexedColors.WHITE.getIndex());
            headerStyle.setFont(headerFont);
            headerStyle.setFillForegroundColor(IndexedColors.DARK_BLUE.getIndex());
            headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);

            // Header row
            Row headerRow = sheet.createRow(0);
            String[] headers = { "ID", "Subject", "Description", "Equipment", "Type", "Priority", "Status",
                    "Assigned Team", "Assigned To", "Scheduled Date", "Created At" };
            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
                cell.setCellStyle(headerStyle);
            }

            // Data rows
            int rowNum = 1;
            for (MaintenanceRequest req : requests) {
                Row row = sheet.createRow(rowNum++);
                row.createCell(0).setCellValue(req.getId());
                row.createCell(1).setCellValue(req.getSubject() != null ? req.getSubject() : "");
                row.createCell(2).setCellValue(req.getDescription() != null ? req.getDescription() : "");
                row.createCell(3).setCellValue(req.getEquipment() != null ? req.getEquipment().getName() : "");
                row.createCell(4).setCellValue(req.getType() != null ? req.getType().name() : "");
                row.createCell(5).setCellValue(req.getPriority() != null ? req.getPriority().name() : "");
                row.createCell(6).setCellValue(req.getStage() != null ? req.getStage().name() : "");
                row.createCell(7).setCellValue(req.getAssignedTeam() != null ? req.getAssignedTeam().getName() : "");
                row.createCell(8).setCellValue(req.getAssignedTo() != null ? req.getAssignedTo().getFullName() : "");
                row.createCell(9).setCellValue(req.getScheduledDate() != null ? req.getScheduledDate().toString() : "");
                row.createCell(10).setCellValue(req.getCreatedAt() != null ? req.getCreatedAt().toString() : "");
            }

            // Auto-size columns
            for (int i = 0; i < headers.length; i++) {
                sheet.autoSizeColumn(i);
            }

            workbook.write(out);
            return out.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate Excel: " + e.getMessage());
        }
    }

    // ==================== HELPER METHODS ====================

    private void addPdfHeader(PdfPTable table, String... headers) {
        Font headerFont = new Font(Font.HELVETICA, 10, Font.BOLD, Color.WHITE);
        for (String header : headers) {
            PdfPCell cell = new PdfPCell(new Phrase(header, headerFont));
            cell.setBackgroundColor(new Color(102, 126, 234));
            cell.setPadding(8);
            cell.setHorizontalAlignment(Element.ALIGN_CENTER);
            table.addCell(cell);
        }
    }

    private void addPdfCell(PdfPTable table, String text) {
        Font cellFont = new Font(Font.HELVETICA, 9, Font.NORMAL);
        PdfPCell cell = new PdfPCell(new Phrase(text != null ? text : "", cellFont));
        cell.setPadding(6);
        table.addCell(cell);
    }
}
