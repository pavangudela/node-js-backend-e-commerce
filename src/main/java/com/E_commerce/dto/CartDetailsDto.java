package com.E_commerce.dto;

import java.math.BigDecimal;

public record CartDetailsDto(
        Long cartId,
        BigDecimal subtotal,
        String currency) {
}
