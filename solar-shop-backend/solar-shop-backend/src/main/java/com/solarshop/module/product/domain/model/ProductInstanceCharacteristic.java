package com.solarshop.module.product.domain.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "product_instance_characteristics")
@EntityListeners(AuditingEntityListener.class)
public class ProductInstanceCharacteristic {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "product_instance_id", nullable = false)
    private ProductInstance productInstance;

    @ManyToOne
    @JoinColumn(name = "characteristic_id", nullable = false)
    private Characteristic characteristic;

    @ManyToOne
    @JoinColumn(name = "characteristic_value_id")
    private CharacteristicValue characteristicValue;

    @Column(name = "manual_value", length = 255)
    private String manualValue;

    @Column(name = "created_at", nullable = false, updatable = false)
    @CreatedDate
    private LocalDateTime createdAt;
}