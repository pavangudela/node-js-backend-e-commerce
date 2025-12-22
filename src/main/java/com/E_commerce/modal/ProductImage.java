package com.E_commerce.modal;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class ProductImage {
@Id
@GeneratedValue(strategy = GenerationType.IDENTITY )
    private  Long id;

    private String imageUrl;
    private String color;
    private boolean isPrimary;
    @ManyToOne( fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    private Product product;
}
