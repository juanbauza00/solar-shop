package com.solarshop.module.order.api.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderRequest {

    @NotNull(message = "La dirección es obligatoria")
    private Long addressId;

    @NotNull(message = "El método de pago es obligatorio")
    private Long paymentMethodId;

    @NotEmpty(message = "Debe incluir al menos un producto")
    @Valid
    private List<OrderItemRequest> items;

    private String notes;
}
