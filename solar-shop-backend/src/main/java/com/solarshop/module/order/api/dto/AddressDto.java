package com.solarshop.module.order.api.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AddressDto {
    private String addressLine;
    private String number;
    private String postalCode;
    private String city;
    private String state;
    private String country;
    private String additionalInfo;
}