package com.E_commerce.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductVariantResponse {
    private Long id;
    private String color;
    private String size;
    private Integer stock;
}
