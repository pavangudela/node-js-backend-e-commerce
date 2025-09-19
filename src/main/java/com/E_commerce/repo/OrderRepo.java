package com.E_commerce.repo;

import com.E_commerce.modal.Order;
import com.E_commerce.modal.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderRepo extends JpaRepository<Order, Long> {
    List<Order> findByUserId(long userId);
      Order findByRazorpayOrderId(String razorpayOrderId);
}
