package com.solarshop.module.order.domain.repository;

import com.solarshop.module.order.domain.model.InvoiceType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface InvoiceTypeRepository extends JpaRepository<InvoiceType, Long> {
    Optional<InvoiceType> findByName(String name);
}