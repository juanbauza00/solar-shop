package com.solarshop.module.notification.domain.repository;

import com.solarshop.module.notification.domain.model.AuditLog;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AuditLogRepository extends MongoRepository<AuditLog, String> {
    List<AuditLog> findByTimestampBetween(LocalDateTime start, LocalDateTime end);
    List<AuditLog> findByUserId(Long userId);
    List<AuditLog> findByAction(String action);
    List<AuditLog> findByEntityTypeAndEntityId(String entityType, String entityId);
}