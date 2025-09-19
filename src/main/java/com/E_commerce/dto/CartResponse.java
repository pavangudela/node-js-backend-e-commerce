package com.E_commerce.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CartResponse {
    private Long  cartId;
    private List<CartItemResponse> items;
    private BigDecimal subtotal;
    private String currency;
}
