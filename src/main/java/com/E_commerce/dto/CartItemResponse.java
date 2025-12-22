package com.E_commerce.dto;


import java.math.BigDecimal;

public record CartItemResponse  (
      Long itemId,
    Long productId,
     Long variantId,
     String productName,
      String primaryImg,
      BigDecimal unitPrice,
      String color,
      String size,
     Integer quantity
){
    public BigDecimal getLineTotal() {
        return unitPrice.multiply(BigDecimal.valueOf(quantity));
    }
}


