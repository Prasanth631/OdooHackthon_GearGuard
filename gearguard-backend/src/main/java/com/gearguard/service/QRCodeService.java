package com.gearguard.service;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.EncodeHintType;
import com.google.zxing.WriterException;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@Service
public class QRCodeService {

    @Value("${app.frontend.url:http://localhost:5173}")
    private String frontendUrl;

    public byte[] generateEquipmentQRCode(Long equipmentId, int width, int height) {
        String content = frontendUrl + "/equipment/" + equipmentId;
        return generateQRCode(content, width, height);
    }

    public byte[] generateEquipmentQRCodeWithDetails(Long equipmentId, String name, String serialNumber, int width,
            int height) {
        // JSON-like content for scanning
        String content = String.format(
                "GEARGUARD:EQ|ID:%d|NAME:%s|SN:%s|URL:%s/equipment/%d",
                equipmentId, name, serialNumber != null ? serialNumber : "", frontendUrl, equipmentId);
        return generateQRCode(content, width, height);
    }

    public byte[] generateQRCode(String content, int width, int height) {
        try {
            QRCodeWriter qrCodeWriter = new QRCodeWriter();
            Map<EncodeHintType, Object> hints = new HashMap<>();
            hints.put(EncodeHintType.CHARACTER_SET, "UTF-8");
            hints.put(EncodeHintType.MARGIN, 2);

            BitMatrix bitMatrix = qrCodeWriter.encode(content, BarcodeFormat.QR_CODE, width, height, hints);

            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            MatrixToImageWriter.writeToStream(bitMatrix, "PNG", outputStream);

            return outputStream.toByteArray();
        } catch (WriterException | IOException e) {
            throw new RuntimeException("Failed to generate QR code: " + e.getMessage());
        }
    }
}
