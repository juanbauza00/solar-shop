package com.solarshop.module.product.domain.repository;

import com.solarshop.module.product.domain.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    List<Category> findByParentId(Long parentId);
    List<Category> findByParentIdIsNull();
    Optional<Category> findBySlug(String slug);
    List<Category> findByIsActiveTrue();
}