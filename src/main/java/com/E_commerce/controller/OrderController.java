package com.E_commerce.controller;

import com.E_commerce.dto.*;
import com.E_commerce.modal.JwtUserAccessor;
import com.E_commerce.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.nio.file.AccessDeniedException;
import java.util.List;
@RestController
@RequestMapping("/api/orders")
public class OrderController{
    @Autowired
    private JwtUserAccessor jwtUser;
    @Autowired
    private OrderService orderService;



    @PreAuthorize("hasRole('CUSTOMER')")
    @PostMapping("/new")
    public ResponseEntity<OrderResponse >checkOut(@RequestBody PlaceOrderRequest request){
//        System.out.println(request +""+ jwtUser);
        return orderService.placeNewOrder(jwtUser.getMail(), request);
    }
    @PreAuthorize("hasRole('CUSTOMER')")
    @GetMapping("/my-orders")
    public ResponseEntity< List<OrderResponse>> getMyOrders(){
        return orderService.getMyorders(jwtUser.getMail());
    }
@PreAuthorize(("hasRole('CUSTOMER')"))
    @PostMapping("/cancel-order-item")
    public ResponseEntity<OrderResponse> cancelOrderItem(@RequestBody CancelOderItemRequest request){
           return orderService.cancelOrderItem(jwtUser.getMail(), request.getOrderId(), request.getItemId());
    }
    @PreAuthorize(("hasRole('ADMIN')"))
    @GetMapping
    public ResponseEntity<List<OrderResponse>> getAllOrders()throws AccessDeniedException {
        return orderService.getAllOrders(jwtUser.role());
    }
    @GetMapping("/{id}")
    public ResponseEntity<OrderResponse> getOrderById(@PathVariable Long id) throws AccessDeniedException {

        return orderService.getOrderById(id, jwtUser.role());

    }
@PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/admin/update-order-status")
    public ResponseEntity<OrderResponse> updateOrderStatus(@RequestBody UpdateOrderStatusRequest request){
        return orderService.updateOrderStatus(request.getOrderId(), request.getStatus());
    }

@PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/admin/update-order-item-status")
    public ResponseEntity< OrderResponse> updateOrderItemStatus(@RequestBody UpdateOrderItemStatusRequest request){
      return   orderService.updateOrderItemStatus(request.getOrderId(), request.getItemId(), request.getStatus());
}

}
