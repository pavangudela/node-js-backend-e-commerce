package com.E_commerce.service;

import com.E_commerce.dto.CartResponse;
import com.E_commerce.modal.Cart;
import com.E_commerce.dto.CartItemResponse;
import com.E_commerce.modal.*;
import com.E_commerce.repo.CartItemsRepo;
import com.E_commerce.repo.CartRepo;
import com.E_commerce.repo.ProductRepo;
import com.E_commerce.repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.util.List;
import java.util.Objects;

@Service
public class  CartService {
    private final int MAX_QTY_PER_ITEM = 10;
    @Autowired
    private ProductRepo productRepo;
    @Autowired
    private UserRepo userRepo;
    @Autowired
    private CartRepo cartRepo;
    @Autowired
    private CartItemsRepo itemsRepo;



   @Transactional(readOnly = true)
    public ResponseEntity<CartResponse> getMyCart(String userMail){
        Cart cart=getOrCreateCart(userMail);
        cart.recalcTotals();
        return  ResponseEntity.ok(toResponse(cart));
    }
@Transactional
    public ResponseEntity<CartResponse> addItem(String userEmail, long productId, Integer qty) {
        if (qty == null || qty < 1) qty=1;

            Cart cart = getOrCreateCart(userEmail);
            Product product = productRepo.findById(productId).orElseThrow(()-> new ResponseStatusException(HttpStatus.NOT_FOUND,"Product Not Found "));
            int Allowed = Math.min(product.getQuantity() == null ? MAX_QTY_PER_ITEM :
                            product.getQuantity(),
                    MAX_QTY_PER_ITEM
            );
            CartItems item = itemsRepo.findByCart_IdAndProduct_Id(cart.getId(), productId).orElse(null);
            if (item == null) {
                int finalQty = Math.min(Allowed, qty);
                if (finalQty < 1) throw new IllegalArgumentException("quantity not available");

                item = new CartItems();
                item.setCart(cart);
                item.setProduct(product);
                item.setQuantity(finalQty);
                item.setUnitPrice(BigDecimal.valueOf(product.getPrice()));
                cart.getItems().add(item);

            } else {

                int newQty = Math.min(item.getQuantity() + qty, Allowed);
                item.setQuantity(newQty);

            }
            cartRepo.save(cart);
            cart.recalcTotals();
            return ResponseEntity.ok().body(toResponse(cart));


    }
    @Transactional
    public ResponseEntity< CartResponse> updateQuantity(String userMail, long productId,Integer qty){
        ensureOwnership(userMail,productId);
        if(qty==null ||qty<1){
          return   removeItem(userMail,productId);

        }
        Cart cart=getOrCreateCart(userMail);
        CartItems item=itemsRepo.findByCart_IdAndProduct_Id(cart.getId(),productId).orElseThrow(()->new ResponseStatusException(HttpStatus.NOT_FOUND,"Item Not Found"));
        ensureOwnership(userMail,productId);
      int Allowed =Math.
              min(item.getProduct()
                      .getQuantity()==null?
                              MAX_QTY_PER_ITEM:
                             item.getProduct()
                              .getQuantity(),
                           MAX_QTY_PER_ITEM);

      item.setQuantity(Math.min(qty,Allowed));
      System.out.println(qty+"   "+Allowed);
       cart.recalcTotals();
      cartRepo.save(cart);
      return ResponseEntity.ok().body(toResponse(cart));
    }
    @Transactional
       public ResponseEntity<CartResponse> removeItem(String userMail ,long productId){
        ensureOwnership(userMail,productId);
        Cart cart =getOrCreateCart(userMail);
        CartItems item=itemsRepo.findByCart_IdAndProduct_Id(cart.getId(),productId).orElseThrow(() ->new ResponseStatusException(HttpStatus.NOT_FOUND,"Item Not Found"));
        cart.getItems().remove(item);
        cart.recalcTotals();
        cartRepo.save(cart);
        return  ResponseEntity.ok().body(toResponse(cart));
       }
       @Transactional
       public  void clearCart(String userMail){
       Cart cart =getOrCreateCart(userMail);
       cart.getItems().clear();
       cartRepo.save(cart);

       }

    public Cart getOrCreateCart(String userMail) {
        User user =  userRepo.findByEmail(userMail).orElseThrow(()-> new ResponseStatusException(HttpStatus.NOT_FOUND, "User Not Found"));
        return cartRepo.findCartByuserId(user.getId()).orElseGet(() -> {
            Cart c = new Cart();
            c.setUser(user);
            return cartRepo.save(c);
        });


    }
    private CartResponse toResponse(Cart cart) {
        List<CartItemResponse> items=cart.getItems().stream().map(ci->
                new CartItemResponse(
                        ci.getId(),
                        ci.getProduct().getId(),
                        ci.getProduct().getName(),
                        ci.getUnitPrice(),
                        ci.getQuantity(),
                        ci.getLineTotal(),
                        ci.getProduct().getImageUrl()
                )).toList();
        return new CartResponse(
               cart.getId(),
               items,
               cart.getSubtotal()==null?BigDecimal.ZERO:cart.getSubtotal(),
               "INR"
       );


    }
    private void ensureOwnership(String userMail, long productId){
       Cart cart=getOrCreateCart(userMail);
       CartItems item=itemsRepo.findByCart_IdAndProduct_Id(cart.getId(),productId).orElseThrow(()->new ResponseStatusException(HttpStatus.NOT_FOUND,"Item Not Found"));
//System.out.println(cart.getId()+" ."+item.getCart().getId());

    }
}