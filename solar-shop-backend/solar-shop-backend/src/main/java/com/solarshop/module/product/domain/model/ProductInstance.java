package com.solarshop.module.product.domain.model;

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
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "product_instances")
@EntityListeners(AuditingEntityListener.class)
public class ProductInstance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(nullable = false)
    private Integer quantity;

    @Column(nullable = false, precision = 11, scale = 2)
    private BigDecimal price;

    @Column(nullable = false, unique = true, length = 100)
    private String sku;

    @Column(unique = true, length = 100)
    private String barcode;

    @Column(name = "is_active", nullable = false)
    private boolean isActive = true;

    @Column(name = "created_at", nullable = false, updatable = false)
    @CreatedDate
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    @LastModifiedDate
    private LocalDateTime updatedAt;

    @Column(name = "min_stock_level", nullable = false)
    private Integer minStockLevel = 5;

    @OneToMany(mappedBy = "productInstance", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProductInstanceCharacteristic> characteristics = new ArrayList<>();

    @OneToMany(mappedBy = "productInstance", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<StockMovement> stockMovements = new ArrayList<>();

    @OneToMany(mappedBy = "productInstance", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Discount> discounts = new ArrayList<>();
}