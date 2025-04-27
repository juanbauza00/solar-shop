package com.solarshop.module.order.domain.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "invoices")
@EntityListeners(AuditingEntityListener.class)
public class Invoice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "sale_id")
    private Sale sale;

    @Column(name = "invoice_number", nullable = false, unique = true, length = 50)
    private String invoiceNumber;

    @ManyToOne
    @JoinColumn(name = "invoice_type_id")
    private InvoiceType invoiceType;

    @Column(name = "issue_date", nullable = false)
    private LocalDateTime issueDate;

    @Column(nullable = false, precision = 11, scale = 2)
    private BigDecimal subtotal;

    @Column(nullable = false, precision = 11, scale = 2)
    private BigDecimal taxes;

    @Column(nullable = false, precision = 11, scale = 2)
    private BigDecimal total;

    @ManyToOne
    @JoinColumn(name = "status_id")
    private InvoiceStatus status;

    @Column(name = "created_at", nullable = false, updatable = false)
    @CreatedDate
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    @LastModifiedDate
    private LocalDateTime updatedAt;

    @Column(name = "pdf_path", length = 255)
    private String pdfPath;
}