package com.solarshop.module.product.api.controller;

import com.solarshop.module.product.api.dto.ProductDto;
import com.solarshop.module.product.domain.service.ProductService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/products")
@RequiredArgsConstructor
@Tag(name = "Products", description = "API para gestión de productos")
public class ProductController {

    private final ProductService productService;

    @GetMapping
    @Operation(summary = "Obtener todos los productos", description = "Retorna una lista paginada de todos los productos activos")
    public ResponseEntity<Page<ProductDto>> findAll(Pageable pageable) {
        return ResponseEntity.ok(productService.findAll(pageable));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener producto por ID", description = "Retorna un producto según su ID")
    public ResponseEntity<ProductDto> findById(@PathVariable Long id) {
        return ResponseEntity.ok(productService.findById(id));
    }

    @GetMapping("/slug/{slug}")
    @Operation(summary = "Obtener producto por slug", description = "Retorna un producto según su slug (URL amigable)")
    public ResponseEntity<ProductDto> findBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(productService.findBySlug(slug));
    }

    @GetMapping("/category/{categoryId}")
    @Operation(summary = "Obtener productos por categoría", description = "Retorna productos filtrados por categoría")
    public ResponseEntity<List<ProductDto>> findByCategory(@PathVariable Long categoryId) {
        return ResponseEntity.ok(productService.findByCategory(categoryId));
    }
}