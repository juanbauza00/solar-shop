package com.solarshop.module.notification.domain.repository;

import com.solarshop.module.notification.domain.model.SystemLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;

@Repository
public interface SystemLogRepository extends MongoRepository<SystemLog, String> {
    Page<SystemLog> findByLevel(String level, Pageable pageable);
    Page<SystemLog> findByTimestampBetween(LocalDateTime start, LocalDateTime end, Pageable pageable);
    Page<SystemLog> findByUserIdAndLevelIn(Long userId, String[] levels, Pageable pageable);
}