package com.E_commerce.modal;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"product_id", "color", "size"})
        }
)
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProductVariant {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String color;
    private String size;
    private Integer stock;
    @ManyToOne(fetch = FetchType.LAZY)
    private Product product;

}
