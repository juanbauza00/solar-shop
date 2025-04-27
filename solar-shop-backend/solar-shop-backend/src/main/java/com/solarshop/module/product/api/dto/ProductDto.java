package com.solarshop.module.product.api.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductDto {
    private Long id;
    private String name;
    private String description;
    private String slug;
    private String category;
    private boolean isActive;
    private List<String> images;
    private BigDecimal price;
    private Integer stock;
    private List<CharacteristicDto> characteristics;
}