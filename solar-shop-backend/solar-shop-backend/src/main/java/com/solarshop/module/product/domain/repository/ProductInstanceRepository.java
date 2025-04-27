package com.solarshop.module.product.domain.repository;

import com.solarshop.module.product.domain.model.ProductInstance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductInstanceRepository extends JpaRepository<ProductInstance, Long> {
    List<ProductInstance> findByProductId(Long productId);

    @Query("SELECT pi FROM ProductInstance pi WHERE pi.quantity <= pi.minStockLevel AND pi.isActive = true")
    List<ProductInstance> findLowStockProducts();
}