package com.E_commerce.modal;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;


@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    private BigDecimal amount;

    private String currency;

    private String razorpayOrderId;
    private String razorpayPaymentId;
    private String razorPaySignature;
@Enumerated(EnumType.STRING)
    private PaymentStatus status;
    private LocalDateTime createdAt= LocalDateTime.now();


}