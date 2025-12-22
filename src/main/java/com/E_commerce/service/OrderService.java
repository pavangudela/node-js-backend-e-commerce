package com.E_commerce.service;
import com.E_commerce.exception.CartEmptyException;
import com.E_commerce.dto.OrderItemResponse;
import com.E_commerce.dto.OrderResponse;
import com.E_commerce.dto.PlaceOrderRequest;
import com.E_commerce.modal.Cart;
import com.E_commerce.modal.*;
import com.E_commerce.repo.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.nio.file.AccessDeniedException;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Service
public class OrderService {
    @Autowired
   private AddressService addressService;
    @Autowired
private CartRepo cartRepo;
    @Autowired
    private CartItemRepo cartItemRepo;
@Autowired
private UserRepo userRepo;
@Autowired
private OrderRepo orderRepo;
@Autowired
private OrderItemRepo itemRepo;
@Autowired
private AddressRepo addressRepo;
//@Autowired
//private PaymentRepo paymentRepo;

@Transactional
  public ResponseEntity<OrderResponse> placeNewOrder(String userMail,    PlaceOrderRequest request){
    if(request.getPaymentType().isEmpty()||request.getAddressId()==null){
        throw   new ResponseStatusException(HttpStatus.BAD_REQUEST,"request body values are must be not empty");
    }
      User user= userRepo.findByEmail(userMail).orElseThrow(()-> new ResponseStatusException(HttpStatus.NOT_FOUND, "User Not Found"));
      Address address=addressRepo.findById(request.getAddressId()).orElseThrow(()->new ResponseStatusException(HttpStatus.NOT_FOUND,"Address Not Found"));
      Cart cart=cartRepo.findCartByuserId(user.getId()).orElseThrow(()-> new CartEmptyException("Cart Not Found"));
      if(cart.getItems().isEmpty()){
          throw new CartEmptyException("Cart Is Empty");

      }
      if(!address.getUser().getId().equals(user.getId())){
          throw  new RuntimeException("this Address is not belongs to your Account");
      }

Order order  =new Order();
      order.setUser(user);
      if(request.getPaymentType().equals("COD")){
          order.setStatus(OrderStatus.PLACED);
      }else {
          order.setStatus(OrderStatus.PENDING);
      }
      order.setPaymentType(request.getPaymentType());
      order.setAddress(address);
       BigDecimal Total=BigDecimal.ZERO;

    System.out.println(order);
    List<OrderItem>items=new ArrayList<>();
      for(CartItem item :cart.getItems()){
              OrderItem oi=new OrderItem();
              oi.setOrder(order);
              oi.setPrice(item.getUnitPrice());
               oi.setVariant(item.getVariant());
              oi.setQuantity(item.getQuantity());
              oi.setLineTotal(item.getLineTotal());
              if(request.getPaymentType().equals("COD")){
                  oi.setStatus(OrderStatus.PLACED);
              }else {
                  oi.setStatus(OrderStatus.PENDING);
              }
              items.add(oi);
              Total=Total.add(item.getLineTotal());
//System.out.println("order item:" +oi);
      }
      order.setItems(items);
     order.setTotalPrice(Total);
      orderRepo.save(order);

           System.out.println(order);
          cartItemRepo.deleteByCartId(cart.getId());
        return ResponseEntity.ok(toResponse(order));


  }
  @Transactional
  public ResponseEntity<OrderResponse> cancelOrderItem( String userMail,long orderId, long itemId ){
    User user= userRepo.findByEmail(userMail).orElseThrow(()-> new ResponseStatusException(HttpStatus.NOT_FOUND, "User Not Found"));
    Order order=orderRepo.findById(orderId).orElseThrow(()-> new ResponseStatusException(HttpStatus.NOT_FOUND, "Order not found"));

    if(!order.getUser().getId().equals(user.getId())){
        throw  new IllegalArgumentException("this is not your order");
    }
    if(order.getItems().isEmpty()){
        throw new IllegalArgumentException("Order items are empty");
    }
    OrderItem item=itemRepo.findById(itemId).orElseThrow(()-> new ResponseStatusException(HttpStatus.NOT_FOUND, "OrderItem not found"));

    if(!item.getOrder().equals(order)){
        throw new IllegalArgumentException("this is not your order item");
    }
    if(item.getStatus()==OrderStatus.DELIVERED ||item.getStatus()==OrderStatus.REFUNDED||item.getStatus()==OrderStatus.RETURNED){
        throw  new IllegalArgumentException("item already" +item.getStatus()+ "not possible to cancel ");
    }
     item.setStatus(OrderStatus.CANCELLED);
   boolean activeItems= itemRepo.existsByOrderIdAndStatusNot(orderId,OrderStatus.CANCELLED);
//    boolean allCanceled=true;
//    for(OrderItem oi:order.getItems()){
//
//        if(!oi.getStatus().equals(OrderStatus.CANCELLED)){
//            allCanceled=false;
//        }
//
//    }
    if(!activeItems){
        order.setStatus(OrderStatus.CANCELLED);
    }
orderRepo.save(order);
    return ResponseEntity.ok().body(toResponse(order));
  }
  @Transactional
  public ResponseEntity<OrderResponse> updateOrderStatus(  long orderId ,OrderStatus status){
      Order order=orderRepo.findById(orderId).orElseThrow(()-> new ResponseStatusException(HttpStatus.NOT_FOUND, "Order not found"));
     order.setStatus(status);
     itemRepo.updateStatusByOrderId(status,orderId);
//     for(OrderItem item:order.getItems()){
//         item.setStatus(status);
//     }
orderRepo.save(order);
     return ResponseEntity.ok().body(toResponse(order));
  }
  @Transactional
  public ResponseEntity<OrderResponse> updateOrderItemStatus(long orderId,long itemId,OrderStatus status){

    Order order=orderRepo.findById(orderId).orElseThrow(()-> new ResponseStatusException(HttpStatus.NOT_FOUND, "Order not found"));

    OrderItem item=itemRepo.findById(itemId).orElseThrow(()-> new ResponseStatusException(HttpStatus.NOT_FOUND, "OrderItem not found"));

      if(!item.getOrder().getId().equals(order.getId())){
          throw new IllegalArgumentException("item not belongs to this order");
       }
    item.setStatus(status);

    boolean needTochangeOrderStatus=true;
     for(OrderItem oi :order.getItems()){


         if(!oi.getStatus().equals(status)){
             needTochangeOrderStatus=false;

         }

         }

      if(needTochangeOrderStatus){
          order.setStatus(status);

     }
      orderRepo.save(order);

      return ResponseEntity.ok().body( toResponse(order));

  }



  @Transactional(readOnly = true)
  public ResponseEntity< List<OrderResponse>> getMyorders(String userMail){
     User user=  userRepo.findByEmail(userMail).orElseThrow(()-> new ResponseStatusException(HttpStatus.NOT_FOUND, "User Not Found"));
     List<Order> orders=orderRepo.findByUserId(user.getId());
     return ResponseEntity.ok().body( orders.stream().map(this::toResponse).toList());

  }

  @Transactional(readOnly = true)
  public ResponseEntity<OrderResponse> getOrderById(Long id, String role) throws AccessDeniedException {
    if(!role.equals("ROLE_ADMIN")){
        throw new AccessDeniedException("Admin only Access this");
    }
     Order order = orderRepo.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Order Not Found"));
      return  ResponseEntity.ok().body(toResponse(order));
  }

   public  OrderResponse toResponse(Order order) {
      List<OrderItemResponse> items=order.getItems().stream().map(oi->
              new OrderItemResponse(
                      oi.getId(),
                      oi.getVariant().getProduct().getId(),
                      oi.getVariant().getId(),
                      oi.getVariant().getProduct().getName(),
                      oi.getColor(),
                      oi.getSize(),
                      oi.getPrice(),
                      oi.getQuantity(),
                      oi.getLineTotal(),
                      oi.getStatus()
              )

      ).toList();
       OrderResponse res=null;
       if(!(order.getUser()==null)) {
        res=   new OrderResponse(
                   order.getId(),
                   order.getUser().getEmail(),
                   items,
                   order.getPaymentType(),
                   order.getTotalPrice(),
                   order.getCreatedAt(),
                   order.getStatus(),
                   addressService.toResponse(order.getAddress())
           );
       }else {
            res=   new OrderResponse(
                    order.getId(),
                    items,
                    order.getPaymentType(),
                    order.getTotalPrice(),
                    order.getCreatedAt(),
                    order.getStatus(),
                    addressService.toResponse(order.getAddress())
            );
        }
       return res;
    }

    public ResponseEntity< List<OrderResponse>> getAllOrders(String role) throws AccessDeniedException {
    System.out.println(role);
         if(!Objects.equals(role, "ROLE_ADMIN")){
             throw new AccessDeniedException( "Admin only access this");

         }

       List<Order> orders= orderRepo.findAll();
         List<OrderResponse> ordersResponse=new ArrayList<>();
         if(!orders.isEmpty()) {
            ordersResponse= orders.stream().map(this::toResponse).toList();
         }
        return ResponseEntity.ok().body(ordersResponse);

    }
}
