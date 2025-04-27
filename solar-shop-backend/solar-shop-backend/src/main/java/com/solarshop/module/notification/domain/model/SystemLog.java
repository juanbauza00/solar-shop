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
@Document(collection = "system_logs")
public class SystemLog {

    @Id
    private String id;

    private LocalDateTime timestamp;
    private String level;
    private String message;
    private Long userId;
    private String exceptionDetails;
    private Map<String, Object> additionalData;
}