package com.E_commerce.modal;

import jakarta.persistence.*;
import jakarta.persistence.criteria.CriteriaBuilder;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CartItem {
@Id
@GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn (name = "variant_id",nullable = false)
    private ProductVariant variant;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cart_id",nullable = false)
    private Cart cart;
    private String size;
    private String color;
    private BigDecimal unitPrice;
    private Integer quantity;
@Transient
    public BigDecimal getLineTotal(){
        return  unitPrice.multiply(BigDecimal.valueOf(quantity));
    }

}
