package com.E_commerce.modal;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Cart {
@Id
@GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
@OneToOne
@JoinColumn(name = "user_id",nullable = false, unique=true)
@ToString.Exclude
private User user;
@OneToMany(mappedBy = "cart",cascade = CascadeType.ALL,orphanRemoval = true)
private List<CartItems> items= new ArrayList<>();
private BigDecimal subtotal;


public void recalcTotals(){
    this.subtotal=items.stream()
            .map(CartItems::getLineTotal)
            .reduce(BigDecimal.ZERO,
               BigDecimal::add);
}


}
