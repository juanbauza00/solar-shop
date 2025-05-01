package com.solarshop.module.product.domain.repository;

import com.solarshop.module.product.domain.model.CharacteristicValue;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CharacteristicValueRepository extends JpaRepository<CharacteristicValue, Long> {
    List<CharacteristicValue> findByCharacteristicId(Long characteristicId);
    List<CharacteristicValue> findByCharacteristicIdAndIsActiveTrue(Long characteristicId);
}