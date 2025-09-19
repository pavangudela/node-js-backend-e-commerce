package com.E_commerce.dto;

import com.E_commerce.modal.OrderStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderItemResponse {
   private Long id;
   private Long productId;
   private String productName;
   private String productImg;
   private BigDecimal price;
   private long quantity;
   private BigDecimal lineTotal;
   private OrderStatus status;
}
