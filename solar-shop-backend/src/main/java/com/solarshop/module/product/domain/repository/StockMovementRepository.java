package com.solarshop.module.product.domain.repository;

import com.solarshop.module.product.domain.model.StockMovement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface StockMovementRepository extends JpaRepository<StockMovement, Long> {
    List<StockMovement> findByProductInstanceId(Long productInstanceId);
    List<StockMovement> findByProductInstanceIdAndMovementType(Long productInstanceId, String movementType);
    List<StockMovement> findByCreatedAtBetween(LocalDateTime start, LocalDateTime end);
}