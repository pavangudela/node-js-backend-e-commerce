package com.E_commerce.dto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProductResponse {
    private Long id;
    private String name;
    private String description;
    private String category;
    private Integer price;

    private Map<String,List<ImageDto>> images;

    private List<ProductVariantResponse> variants;
}
