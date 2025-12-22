package com.E_commerce.repo;

import com.E_commerce.modal.OrderItem;
import com.E_commerce.modal.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

public interface OrderItemRepo extends JpaRepository<OrderItem ,Long> {

    boolean existsByOrderIdAndStatusNot(Long orderId , OrderStatus status);

    @Modifying
    @Query(" UPDATE OrderItem oi set oi.status= :status WHERE oi.order.id= :orderId ")
    int updateStatusByOrderId(OrderStatus status , Long Id);

}
