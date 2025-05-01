package com.solarshop.module.order.domain.repository;

import com.solarshop.module.order.domain.model.Sale;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface SaleRepository extends JpaRepository<Sale, Long> {
    List<Sale> findByOrderId(Long orderId);
    List<Sale> findBySaleDateBetween(LocalDateTime start, LocalDateTime end);
}