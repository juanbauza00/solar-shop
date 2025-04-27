package com.solarshop.module.order.domain.repository;

import com.solarshop.module.order.domain.model.Invoice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface InvoiceRepository extends JpaRepository<Invoice, Long> {
    Optional<Invoice> findByInvoiceNumber(String invoiceNumber);
    List<Invoice> findByIssueDateBetween(LocalDateTime startDate, LocalDateTime endDate);
    List<Invoice> findBySale_Order_UserId(Long userId);
}
