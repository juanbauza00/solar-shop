package com.solarshop.module.order.domain.repository;

import com.solarshop.module.order.domain.model.InvoiceStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface InvoiceStatusRepository extends JpaRepository<InvoiceStatus, Long> {
    Optional<InvoiceStatus> findByName(String name);
}