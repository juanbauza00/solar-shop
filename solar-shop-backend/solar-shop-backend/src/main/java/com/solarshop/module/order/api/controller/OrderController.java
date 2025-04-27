package com.solarshop.module.order.api.controller;

import com.solarshop.module.order.api.dto.OrderDto;
import com.solarshop.module.order.api.dto.OrderRequest;
import com.solarshop.module.order.api.dto.StatusUpdateRequest;
import com.solarshop.module.order.domain.service.OrderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/orders")
@RequiredArgsConstructor
@Tag(name = "Orders", description = "API para gestión de pedidos")
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    @Operation(summary = "Crear pedido", description = "Crea un nuevo pedido con los productos especificados")
    public ResponseEntity<OrderDto> create(@Valid @RequestBody OrderRequest request) {
        return ResponseEntity.ok(orderService.create(request));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE')")
    @Operation(summary = "Obtener todos los pedidos", description = "Retorna todos los pedidos (solo administradores y empleados)")
    public ResponseEntity<List<OrderDto>> findAll() {
        return ResponseEntity.ok(orderService.findAll());
    }

    @GetMapping("/user")
    @Operation(summary = "Obtener pedidos del usuario actual", description = "Retorna los pedidos del usuario autenticado")
    public ResponseEntity<List<OrderDto>> findByCurrentUser() {
        return ResponseEntity.ok(orderService.findByCurrentUser());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener pedido por ID", description = "Retorna un pedido específico por su ID")
    public ResponseEntity<OrderDto> findById(@PathVariable Long id) {
        return ResponseEntity.ok(orderService.findById(id));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE')")
    @Operation(summary = "Actualizar estado del pedido", description = "Actualiza el estado de un pedido (solo administradores y empleados)")
    public ResponseEntity<OrderDto> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody StatusUpdateRequest request) {
        return ResponseEntity.ok(orderService.updateStatus(id, request.getStatusId(), request.getNotes()));
    }
}