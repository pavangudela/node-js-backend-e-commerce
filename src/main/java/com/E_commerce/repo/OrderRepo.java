package com.E_commerce.repo;

import com.E_commerce.modal.Order;
import com.E_commerce.modal.User;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
@Repository
public interface OrderRepo extends JpaRepository<Order, Long> {


    @EntityGraph(attributePaths = {
            "items",
            "items.variant",
            "items.variant.product"
    })
   List<Order>findByUserId(Long userId);

    @EntityGraph(attributePaths = {
            "items",
            "items.variant",
            "items.variant.product"
    })
 Optional<Order>  findById(Long id);

      Order findByRazorpayOrderId(String razorpayOrderId);
}
