package com.solarshop.module.notification.domain.repository;

import com.solarshop.module.notification.domain.model.NotificationTemplate;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface NotificationTemplateRepository extends MongoRepository<NotificationTemplate, String> {
    Optional<NotificationTemplate> findByName(String name);
    List<NotificationTemplate> findByType(String type);
    List<NotificationTemplate> findByIsActiveTrue();
}