package com.solarshop.module.product.domain.repository;

import com.solarshop.module.product.domain.model.ProductImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductImageRepository extends JpaRepository<ProductImage, Long> {
    List<ProductImage> findByProductId(Long productId);
    List<ProductImage> findByProductInstanceId(Long productInstanceId);
    List<ProductImage> findByProductIdAndIsPrimaryTrue(Long productId);
}