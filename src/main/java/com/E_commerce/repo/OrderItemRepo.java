package com.E_commerce.repo;

import com.E_commerce.modal.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderItemRepo extends JpaRepository<OrderItem ,Long> {
}
