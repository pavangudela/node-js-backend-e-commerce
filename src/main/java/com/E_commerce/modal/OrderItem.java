package com.E_commerce.modal;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.math.BigDecimal;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude = "order")
public class OrderItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private BigDecimal price;
    private long quantity;

    private String size;
    private String color;
    private BigDecimal lineTotal;
    @ManyToOne(fetch =FetchType.LAZY)
    @JoinColumn(name = "product_variant_id")
    private ProductVariant variant;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id")
    private Order order;
    @Enumerated(EnumType.STRING)
    private OrderStatus status;


}
