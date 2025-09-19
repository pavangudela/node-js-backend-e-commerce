package com.E_commerce.modal;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;


import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
@Entity
@Table(name = "orders")
@NoArgsConstructor
@AllArgsConstructor
@Data
@ToString(exclude = "items")
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Enumerated(EnumType.STRING)
    private  OrderStatus status;
    private BigDecimal totalPrice;
    @OneToMany(mappedBy = "order" ,cascade = CascadeType.ALL,orphanRemoval = true)
    private List<OrderItem> items;
    @ManyToOne
    @JoinColumn(name = "user_id" ,nullable = true)
    private User user;
    private LocalDateTime CreatedAt=LocalDateTime.now();
    private String paymentType;
    @ManyToOne
    @JoinColumn(name = "address_id")
    private Address address;

  private  String razorpayOrderId;

  public void updateOrderItemsStatus(OrderStatus status){
      items.forEach(item -> item.setStatus(status));
  }

}
