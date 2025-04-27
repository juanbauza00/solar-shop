package com.solarshop.module.notification.domain.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "audit_logs")
public class AuditLog {

    @Id
    private String id;

    private LocalDateTime timestamp;
    private Long userId;
    private String action;
    private String entityType;
    private String entityId;
    private Map<String, Object> oldValue;
    private Map<String, Object> newValue;
}