package com.solarshop.module.product.domain.repository;

import com.solarshop.module.product.domain.model.Discount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface DiscountRepository extends JpaRepository<Discount, Long> {
    List<Discount> findByProductInstanceId(Long productInstanceId);
    List<Discount> findByIsActiveTrueAndStartDateBeforeAndEndDateAfter(LocalDateTime now, LocalDateTime now2);
    Optional<Discount> findByDiscountCode(String discountCode);
}
