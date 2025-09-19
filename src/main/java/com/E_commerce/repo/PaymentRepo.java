package com.E_commerce.repo;

import com.E_commerce.modal.Order;
import com.E_commerce.modal.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PaymentRepo extends JpaRepository<Payment,Long> {
    Payment findByOrder(Order order);
      Payment findByRazorpayOrderId(String razorpayOrderId);
    Optional <Payment> findByRazorpayPaymentId(String razorpayPaymentId);


}
