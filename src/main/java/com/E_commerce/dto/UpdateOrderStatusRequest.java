package com.E_commerce.dto;

import com.E_commerce.modal.OrderStatus;
import lombok.Data;

@Data
public class UpdateOrderStatusRequest {
    private Long orderId;
    private OrderStatus status;
}
