package com.solarshop.module.notification.api.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SystemLogDto {
    private String id;
    private LocalDateTime timestamp;
    private String level;
    private String message;
    private Long userId;
    private String exceptionDetails;
    private Map<String, Object> additionalData;
}