package com.solarshop.module.notification.domain.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "notification_channels")
public class NotificationChannel {

    @Id
    private String id;

    private String name;
    private String type;
    private String provider;
    private Map<String, Object> config;
    private boolean isActive;
}