package com.E_commerce.dto;

import com.E_commerce.modal.OrderStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateOrderItemStatusRequest {
    private Long orderId;
    private Long itemId;
    private OrderStatus status;
}
