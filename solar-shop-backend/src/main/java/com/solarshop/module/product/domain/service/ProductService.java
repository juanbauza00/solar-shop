package com.solarshop.module.product.domain.service;

import com.solarshop.module.product.api.dto.CharacteristicDto;
import com.solarshop.module.product.api.dto.ProductDto;
import com.solarshop.module.product.domain.model.Product;
import com.solarshop.module.product.domain.model.ProductImage;
import com.solarshop.module.product.domain.model.ProductInstance;
import com.solarshop.module.product.domain.model.ProductInstanceCharacteristic;
import com.solarshop.module.product.domain.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;

    @Transactional(readOnly = true)
    public Page<ProductDto> findAll(Pageable pageable) {
        return productRepository.findByIsActiveTrue(pageable)
                .map(this::mapToDto);
    }

    @Transactional(readOnly = true)
    public ProductDto findById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado con id: " + id));
        return mapToDto(product);
    }

    @Transactional(readOnly = true)
    public ProductDto findBySlug(String slug) {
        Product product = productRepository.findBySlug(slug)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado con slug: " + slug));
        return mapToDto(product);
    }

    @Transactional(readOnly = true)
    public List<ProductDto> findByCategory(Long categoryId) {
        return productRepository.findByCategoryId(categoryId).stream()
                .filter(Product::isActive)
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public ProductDto mapToDto(Product product) {
        if (product == null) return null;

        // Obtener la primera instancia activa del producto para precio y stock
        ProductInstance instance = product.getInstances().stream()
                .filter(ProductInstance::isActive)
                .findFirst()
                .orElse(null);

        // Recopilar características si hay una instancia
        List<CharacteristicDto> characteristics = Collections.emptyList();
        if (instance != null) {
            characteristics = instance.getCharacteristics().stream()
                    .map(this::mapCharacteristicToDto)
                    .collect(Collectors.toList());
        }

        // Recopilar URLs de imágenes
        List<String> images = product.getImages().stream()
                .map(ProductImage::getImagePath)
                .collect(Collectors.toList());

        return ProductDto.builder()
                .id(product.getId())
                .name(product.getName())
                .description(product.getDescription())
                .slug(product.getSlug())
                .category(product.getCategory() != null ? product.getCategory().getName() : null)
                .isActive(product.isActive())
                .images(images)
                .price(instance != null ? instance.getPrice() : BigDecimal.ZERO)
                .stock(instance != null ? instance.getQuantity() : 0)
                .characteristics(characteristics)
                .build();
    }

    private CharacteristicDto mapCharacteristicToDto(ProductInstanceCharacteristic characteristic) {
        String value = characteristic.getCharacteristicValue() != null ?
                characteristic.getCharacteristicValue().getValue() :
                characteristic.getManualValue();

        return CharacteristicDto.builder()
                .name(characteristic.getCharacteristic().getName())
                .value(value)
                .build();
    }
}