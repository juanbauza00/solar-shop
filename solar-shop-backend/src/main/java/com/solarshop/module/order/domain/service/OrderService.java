package com.solarshop.module.order.domain.service;

import com.solarshop.module.notification.domain.service.NotificationService;
import com.solarshop.module.order.api.dto.*;
import com.solarshop.module.order.domain.model.*;
import com.solarshop.module.order.domain.repository.OrderRepository;
import com.solarshop.module.order.domain.repository.OrderStatusRepository;
import com.solarshop.module.order.domain.repository.PaymentMethodRepository;
import com.solarshop.module.product.domain.model.ProductInstance;
import com.solarshop.module.product.domain.repository.ProductInstanceRepository;
import com.solarshop.module.user.domain.model.Address;
import com.solarshop.module.user.domain.model.User;
import com.solarshop.module.user.domain.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final ProductInstanceRepository productInstanceRepository;
    private final OrderStatusRepository orderStatusRepository;
    private final PaymentMethodRepository paymentMethodRepository;
    private final InvoiceService invoiceService;
    private final NotificationService notificationService;

    @Transactional
    public OrderDto create(OrderRequest request) {
        // Obtener usuario actual
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        // Crear orden
        OrderStatus pendingStatus = orderStatusRepository.findByName("PENDING")
                .orElseThrow(() -> new RuntimeException("Estado de pedido 'PENDING' no encontrado"));

        Order order = Order.builder()
                .user(user)
                .status(pendingStatus)
                .notes(request.getNotes())
                .build();

        // Crear venta asociada a la orden
        PaymentMethod paymentMethod = paymentMethodRepository.findById(request.getPaymentMethodId())
                .orElseThrow(() -> new RuntimeException("Método de pago no encontrado"));

        Sale sale = Sale.builder()
                .order(order)
                .paymentMethod(paymentMethod)
                .build();

        // Agregar detalles de venta
        for (OrderItemRequest itemRequest : request.getItems()) {
            ProductInstance productInstance = productInstanceRepository.findById(itemRequest.getProductId())
                    .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

            // Verificar stock
            if (productInstance.getQuantity() < itemRequest.getQuantity()) {
                throw new RuntimeException("Stock insuficiente para el producto: " + productInstance.getProduct().getName());
            }

            // Crear detalle de venta
            SaleDetail saleDetail = SaleDetail.builder()
                    .productId(productInstance.getId())
                    .quantity(itemRequest.getQuantity())
                    .price(productInstance.getPrice())
                    .build();

            sale.addDetail(saleDetail);

            // Actualizar stock
            productInstance.setQuantity(productInstance.getQuantity() - itemRequest.getQuantity());
            productInstanceRepository.save(productInstance);
        }

        // Guardar orden y venta
        order.getSales().add(sale);
        Order savedOrder = orderRepository.save(order);

        // Registrar historial de estado
        OrderStatusHistory statusHistory = OrderStatusHistory.builder()
                .order(savedOrder)
                .status(pendingStatus)
                .changedBy(user)
                .notes("Orden creada")
                .build();
        savedOrder.getStatusHistory().add(statusHistory);

        // Generar factura
        invoiceService.generateInvoice(sale);

        // Enviar notificación
        notificationService.sendEmail(
                user.getEmail(),
                "Pedido Confirmado - #" + savedOrder.getId(),
                "Tu pedido ha sido recibido y está siendo procesado. Número de pedido: " + savedOrder.getId()
        );

        return mapToDto(savedOrder);
    }

    @Transactional(readOnly = true)
    public List<OrderDto> findAll() {
        return orderRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<OrderDto> findByCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        return orderRepository.findByUserId(user.getId()).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public OrderDto findById(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pedido no encontrado"));
        return mapToDto(order);
    }

    @Transactional
    public OrderDto updateStatus(Long id, Long statusId, String notes) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pedido no encontrado"));

        OrderStatus newStatus = orderStatusRepository.findById(statusId)
                .orElseThrow(() -> new RuntimeException("Estado no encontrado"));

        // Obtener usuario actual
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        // Actualizar estado
        order.setStatus(newStatus);

        // Registrar historial
        OrderStatusHistory statusHistory = OrderStatusHistory.builder()
                .order(order)
                .status(newStatus)
                .changedAt(LocalDateTime.now())
                .changedBy(user)
                .notes(notes)
                .build();

        order.getStatusHistory().add(statusHistory);

        // Enviar notificación
        notificationService.sendEmail(
                order.getUser().getEmail(),
                "Actualización de Pedido - #" + order.getId(),
                "Tu pedido #" + order.getId() + " ha sido actualizado a: " + newStatus.getName()
        );

        return mapToDto(orderRepository.save(order));
    }

    public OrderDto mapToDto(Order order) {
        // Obtener la primera venta asociada al pedido
        Sale sale = order.getSales().isEmpty() ? null : order.getSales().get(0);

        // Mapear items si existe la venta
        List<OrderItemDto> items = sale != null ? sale.getDetails().stream()
                .map(this::mapToOrderItemDto)
                .collect(Collectors.toList()) :
                Collections.emptyList();

        // Calcular totales
        BigDecimal subtotal = sale != null ? sale.calculateSubtotal() : BigDecimal.ZERO;
        BigDecimal discount = sale != null ? sale.getDiscount() : BigDecimal.ZERO;
        BigDecimal total = sale != null ? sale.calculateTotal() : BigDecimal.ZERO;

        // Información de pago y factura
        PaymentInfoDto paymentInfo = null;
        if (sale != null) {
            String invoiceNumber = sale.getInvoice() != null ? sale.getInvoice().getInvoiceNumber() : null;

            paymentInfo = PaymentInfoDto.builder()
                    .method(sale.getPaymentMethod().getName())
                    .status(sale.getPaymentStatus() != null ? sale.getPaymentStatus().getName() : "PENDIENTE")
                    .invoiceNumber(invoiceNumber)
                    .build();
        }

        // Construir DTO
        return OrderDto.builder()
                .id(order.getId())
                .status(order.getStatus().getName())
                .createdAt(order.getCreatedAt())
                .updatedAt(order.getUpdatedAt())
                .notes(order.getNotes())
                .address(order.getAddress() != null ? mapToAddressDto(order.getAddress()) : null)
                .items(items)
                .payment(paymentInfo)
                .subtotal(subtotal)
                .discount(discount)
                .taxes(BigDecimal.ZERO) // Calcular impuestos según lógica de negocio
                .total(total)
                .build();
    }

    private OrderItemDto mapToOrderItemDto(SaleDetail detail) {
        ProductInstance product = productInstanceRepository.findById(detail.getProductId())
                .orElse(null);

        String productName = product != null ? product.getProduct().getName() : "Producto no disponible";

        BigDecimal total = detail.getPrice()
                .multiply(BigDecimal.valueOf(detail.getQuantity()))
                .multiply(BigDecimal.ONE.subtract(detail.getProductDiscount().divide(BigDecimal.valueOf(100))));

        return OrderItemDto.builder()
                .productId(detail.getProductId())
                .productName(productName)
                .quantity(detail.getQuantity())
                .unitPrice(detail.getPrice())
                .discount(detail.getProductDiscount())
                .total(total)
                .build();
    }

    private AddressDto mapToAddressDto(Address address) {
        // Implementar mapeo de dirección
        return AddressDto.builder()
                // ... mapeo completo
                .build();
    }
}
