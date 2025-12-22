package com.E_commerce.modal;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String description;
    private Integer price;
   @OneToMany(cascade = CascadeType.ALL , orphanRemoval = true, mappedBy = "product")
    private List<ProductImage> images;
   @OneToMany(cascade = CascadeType.ALL , orphanRemoval = true, mappedBy = "product")
   private List<ProductVariant> variants;
    private String category;
    private String subCategory;
    private List<String> sizes;
    private List<String> colors;
    private String material;
    private String fit;
    private String pattern;
    private Double averageRating;
    private Integer totalReviews;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private boolean isActive;
}
