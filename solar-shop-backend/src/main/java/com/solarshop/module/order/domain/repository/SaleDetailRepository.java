package com.solarshop.module.order.domain.repository;

import com.solarshop.module.order.domain.model.SaleDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SaleDetailRepository extends JpaRepository<SaleDetail, Long> {
    List<SaleDetail> findBySaleId(Long saleId);
    List<SaleDetail> findByProductId(Long productId);
}
