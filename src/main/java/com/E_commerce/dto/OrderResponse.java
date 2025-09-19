package com.E_commerce.dto;

import com.E_commerce.modal.Address;
import com.E_commerce.modal.OrderStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderResponse {

    private Long orderId;
    private String userEmail;
    private List<OrderItemResponse> items;
    private String paymentType;
    private BigDecimal totalPrice;
    private LocalDateTime createdAt;
    private OrderStatus status;
    private AddressResponseAndRequest address;

    public OrderResponse(Long orderId,  List<OrderItemResponse> items, String paymentType, BigDecimal totalPrice, LocalDateTime createdAt, OrderStatus status, AddressResponseAndRequest address) {
        this.orderId = orderId;

        this.items = items;
        this.paymentType = paymentType;
        this.totalPrice = totalPrice;
        this.createdAt = createdAt;
        this.status = status;
        this.address = address;
    }
}
