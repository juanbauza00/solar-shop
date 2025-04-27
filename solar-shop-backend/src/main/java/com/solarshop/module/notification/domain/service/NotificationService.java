package com.solarshop.module.notification.domain.service;

import com.solarshop.module.notification.domain.model.Notification;
import com.solarshop.module.notification.domain.model.SystemLog;
import com.solarshop.module.notification.domain.repository.NotificationRepository;
import com.solarshop.module.notification.domain.repository.SystemLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final SystemLogRepository systemLogRepository;
    private final JavaMailSender mailSender;

    public void sendEmail(String to, String subject, String content) {
        try {
            // Guardar en la base de datos
            Notification notification = Notification.builder()
                    .type("EMAIL")
                    .subject(subject)
                    .content(content)
                    .status("PENDING")
                    .timestamp(LocalDateTime.now())
                    .sourceService("NOTIFICATION_SERVICE")
                    .build();

            notificationRepository.save(notification);

            // Enviar email
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject(subject);
            message.setText(content);

            mailSender.send(message);

            // Actualizar estado
            notification.setStatus("SENT");
            notificationRepository.save(notification);

            // Registrar éxito
            logInfo("Email enviado correctamente a: " + to);
        } catch (Exception e) {
            // Registrar error
            logError("Error al enviar email a: " + to, e);
            throw new RuntimeException("Error al enviar email", e);
        }
    }

    public void sendSms(String phoneNumber, String message) {
        // Implementar integración con servicio SMS (Twilio, etc.)
        // Guardar notificación y actualizar estado
    }

    public void sendPushNotification(Long userId, String title, String message) {
        // Implementar integración con FCM u otro servicio de notificaciones push
        // Guardar notificación y actualizar estado
    }

    public void sendSystemNotification(Long userId, String subject, String content) {
        Notification notification = Notification.builder()
                .userId(userId)
                .timestamp(LocalDateTime.now())
                .type("SYSTEM")
                .subject(subject)
                .content(content)
                .status("DELIVERED")
                .sourceService("NOTIFICATION_SERVICE")
                .build();

        notificationRepository.save(notification);
    }

    // Métodos para logging
    public void logInfo(String message) {
        SystemLog log = SystemLog.builder()
                .timestamp(LocalDateTime.now())
                .level("INFO")
                .message(message)
                .build();

        systemLogRepository.save(log);
    }

    public void logWarning(String message) {
        SystemLog log = SystemLog.builder()
                .timestamp(LocalDateTime.now())
                .level("WARN")
                .message(message)
                .build();

        systemLogRepository.save(log);
    }

    public void logError(String message, Exception e) {
        Map<String, Object> additionalData = new HashMap<>();
        additionalData.put("exceptionClass", e.getClass().getName());

        SystemLog log = SystemLog.builder()
                .timestamp(LocalDateTime.now())
                .level("ERROR")
                .message(message)
                .exceptionDetails(e.getMessage())
                .additionalData(additionalData)
                .build();

        systemLogRepository.save(log);
    }
}