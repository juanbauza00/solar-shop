package com.solarshop.module.user.domain.repository;

import com.solarshop.module.user.domain.model.PasswordHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PasswordHistoryRepository extends JpaRepository<PasswordHistory, Long> {
    List<PasswordHistory> findByUserIdOrderByChangedAtDesc(Long userId);
}