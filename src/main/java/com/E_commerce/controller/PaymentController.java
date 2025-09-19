package com.E_commerce.controller;

import com.E_commerce.dto.PaymentResponse;
import com.E_commerce.dto.PaymentVerifyRequesst;
import com.E_commerce.dto.RazorpayOrderResponse;
import com.E_commerce.service.PaymentService;
import com.razorpay.RazorpayException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import  org.jetbrains.annotations.NotNull;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin("*")
public class PaymentController {
    @Autowired
    private PaymentService paymentService;


    @PostMapping("/new/{orderId}")
    public ResponseEntity<RazorpayOrderResponse> createOrder(@PathVariable Long orderId) throws RazorpayException {
        return paymentService.createRazorpayOrder(orderId);
    }

    @PostMapping("/verify")
    public ResponseEntity<PaymentResponse> verify(  @RequestBody PaymentVerifyRequesst request) throws RazorpayException {
        System.out.println(request);
        boolean valid=paymentService.verifyPayment(request.getOrderId(),request.getPaymentId(),request.getSignature());

         if(valid){
             return ResponseEntity.ok(new PaymentResponse(true, "payment successful"));
         }
         return   ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new PaymentResponse(false,"payment failed"));
    }

}
