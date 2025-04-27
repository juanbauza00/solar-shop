package com.solarshop.module.notification.domain.repository;

import com.solarshop.module.notification.domain.model.Notification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends MongoRepository<Notification, String> {
    List<Notification> findByUserIdOrderByTimestampDesc(Long userId);
    Page<Notification> findByUserIdAndStatus(Long userId, String status, Pageable pageable);
    long countByUserIdAndStatus(Long userId, String status);
}
