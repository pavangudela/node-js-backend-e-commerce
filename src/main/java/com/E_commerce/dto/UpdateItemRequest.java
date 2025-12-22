package com.E_commerce.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateItemRequest {
    private  Long  variantId;
    Integer qty;
}
