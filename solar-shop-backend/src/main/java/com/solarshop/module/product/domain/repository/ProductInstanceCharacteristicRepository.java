package com.solarshop.module.product.domain.repository;

import com.solarshop.module.product.domain.model.ProductInstanceCharacteristic;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductInstanceCharacteristicRepository extends JpaRepository<ProductInstanceCharacteristic, Long> {
    List<ProductInstanceCharacteristic> findByProductInstanceId(Long productInstanceId);
}