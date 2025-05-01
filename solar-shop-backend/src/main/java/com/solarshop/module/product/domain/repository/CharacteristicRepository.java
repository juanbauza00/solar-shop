package com.solarshop.module.product.domain.repository;

import com.solarshop.module.product.domain.model.Characteristic;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CharacteristicRepository extends JpaRepository<Characteristic, Long> {
    List<Characteristic> findByProductId(Long productId);
    List<Characteristic> findByIsFilterableTrue();
}