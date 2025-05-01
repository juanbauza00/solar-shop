package com.solarshop.module.product.domain.repository;

import com.solarshop.module.product.domain.model.PriceHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface PriceHistoryRepository extends JpaRepository<PriceHistory, Long> {
    List<PriceHistory> findByProductInstanceId(Long productInstanceId);
    List<PriceHistory> findByChangedAtBetween(LocalDateTime start, LocalDateTime end);
}