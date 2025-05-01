package com.solarshop.module.notification.domain.repository;

import com.solarshop.module.notification.domain.model.NotificationChannel;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface NotificationChannelRepository extends MongoRepository<NotificationChannel, String> {
    List<NotificationChannel> findByType(String type);
    List<NotificationChannel> findByIsActiveTrue();
    Optional<NotificationChannel> findByName(String name);
}