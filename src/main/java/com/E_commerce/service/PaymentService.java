package com.E_commerce.service;

import com.E_commerce.dto.RazorpayOrderResponse;
import com.E_commerce.modal.Order;
import com.E_commerce.modal.OrderStatus;
import com.E_commerce.modal.Payment;
import com.E_commerce.modal.PaymentStatus;
import com.E_commerce.repo.OrderRepo;
import com.E_commerce.repo.PaymentRepo;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;

import static com.razorpay.Utils.*;

@Service
public class PaymentService {

    private RazorpayClient razorpayClient;
    @Autowired
    private OrderRepo orderRepo;
    @Autowired
    private PaymentRepo paymentRepo;

   @Value("${razorpay.key.id}")
  private String key;
@Value("${razorpay.key.secret}")
    private String secret;



    public PaymentService() throws RazorpayException {

    }


    public ResponseEntity<RazorpayOrderResponse> createRazorpayOrder(Long orderId) throws RazorpayException {
        razorpayClient = new RazorpayClient(key,secret);
System.out.println("secret : "+secret+ "     key : "+key);
    Order order=orderRepo.getReferenceById(orderId);
        long amount = order.getTotalPrice()
                .multiply(BigDecimal.valueOf(100))
                .longValue();
        System.out.println(amount);
    JSONObject options=new JSONObject();
    options.put("amount",amount);
    options.put("currency","INR");
    options.put("receipt","order_rcpt_"+order.getId());
    options.put("payment_capture",1);

    com.razorpay.Order razorOrder=razorpayClient.orders.create(options);
        Payment payment= new Payment();
        payment.setOrder(order);
        payment.setStatus(PaymentStatus.PENDING);
        payment.setAmount(order.getTotalPrice());
        payment.setRazorpayOrderId(razorOrder.get("id"));
        payment.setCurrency("INR");
        order.setRazorpayOrderId(razorOrder.get("id"));





        paymentRepo.save(payment);
   orderRepo.save(order);
return ResponseEntity.ok().body( new RazorpayOrderResponse(payment.getRazorpayOrderId(),
        amount,payment.getCurrency(),key));

    }

    public boolean verifyPayment(String orderId , String paymentId, String signature) throws RazorpayException {

        if (paymentRepo.findByRazorpayPaymentId(paymentId).isPresent()) {
            return true;
        }
        try {
            JSONObject attributes = new JSONObject();
            attributes.put("razorpay_order_id", orderId);
            attributes.put("razorpay_payment_id", paymentId);
            attributes.put("razorpay_signature", signature);
            System.out.println("signature :"+signature);

            if(verifyPaymentSignature(attributes, secret)){
                Payment payment =paymentRepo.findByRazorpayOrderId(orderId);
                payment.setRazorpayPaymentId(paymentId);
                payment.setRazorPaySignature(signature);
                payment.setStatus(PaymentStatus.SUCCUSS);
                  paymentRepo.save(payment);
                Order order=payment.getOrder();
                   order.setStatus(OrderStatus.PLACED);
                   order.updateOrderItemsStatus(OrderStatus.PLACED);
                   orderRepo.save(order);
                return true;
            }

        } catch (Exception e) {
           return false;
        }
        return true;
    }

}
