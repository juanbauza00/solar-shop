package com.solarshop.module.order.domain.repository;

import com.solarshop.module.order.domain.model.DiscountSource;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DiscountSourceRepository extends JpaRepository<DiscountSource, Long> {
    Optional<DiscountSource> findByName(String name);
}