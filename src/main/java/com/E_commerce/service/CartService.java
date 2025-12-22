package com.E_commerce.service;
import com.E_commerce.dto.*;
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
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class  CartService {
    private final int MAX_QTY_PER_ITEM = 10;
    @Autowired
    private ProductRepo productRepo;
    @Autowired
    private ProductImageRepo imageRepo;
    @Autowired
    private UserRepo userRepo;
    @Autowired
    private CartRepo cartRepo;
    @Autowired
    private CartItemRepo itemsRepo;

    @Autowired
    private ProductVariantRepo variantRepo;


   @Transactional(readOnly = true)
    public ResponseEntity<CartResponse> getMyCart(String email){


           CartDetailsDto summary = cartRepo.findCartDetails(email).orElse(null);
           List<CartItemResponse> items = cartRepo.findCartItems(email);

           if (summary == null) {
               return  ResponseEntity.ok(new CartResponse(null, List.of(), BigDecimal.ZERO, "INR"));
           }

       CartResponse response= new CartResponse(
                   summary.cartId(),
                   items,
                   summary.subtotal(),
                   summary.currency()
           );


       return  ResponseEntity.ok(response);
    }
@Transactional
    public ResponseEntity<CartResponse> addItem(String userEmail, AddItemRequest request) {

    long productId= request.getProductId();
    if(request.getVariantId()==null) {
        System.out.println("hello"+request.getVariantId());
        throw new ResponseStatusException(HttpStatus.NOT_FOUND,"variantId is empty");

    }
    Integer qty= request.getQty();
        if (qty == null || qty < 1) qty=1;

            Cart cart = getOrCreateCart(userEmail);

            Product product = productRepo.findById(productId).orElseThrow(()-> new ResponseStatusException(HttpStatus.NOT_FOUND,"Product Not Found "));
          ProductVariant variant=  variantRepo.findById(request.getVariantId()).orElseThrow(()->new ResponseStatusException(HttpStatus.NOT_FOUND,"this variant is not available"));
          if(!variant.getProduct().getId().equals(productId)){
                throw new  ResponseStatusException(HttpStatus.BAD_REQUEST,"this variant not belongs to this product");
          }
          if(variant.getStock()<1){
              throw  new ResponseStatusException(HttpStatus.NOT_FOUND,"this variant is out of stock now !");
          }

            int Allowed = Math.min(variant.getStock(), MAX_QTY_PER_ITEM);
            CartItem item = itemsRepo.findByCart_IdAndVariant_Id(cart.getId(), variant.getId()).orElse(null);
            if (item == null) {
                int finalQty = Math.min(Allowed, qty);


                item = new CartItem();
                item.setCart(cart);
                item.setVariant(variant);
                item.setColor(variant.getColor());
                item.setSize(variant.getSize());
                item.setQuantity(finalQty);
                item.setUnitPrice(BigDecimal.valueOf(product.getPrice()));
                cart.getItems().add(item);

            } else {

                int newQty = Math.min(qty, Allowed);
                item.setQuantity(newQty);

            }
            cartRepo.save(cart);
            cart.recalcTotals();
            return ResponseEntity.ok().body(toResponse(cart));


    }
    @Transactional
    public ResponseEntity< CartResponse> updateQuantity(String userMail, long productId, UpdateItemRequest request){
       if(request.getVariantId()==null){
           throw  new ResponseStatusException(HttpStatus.NOT_FOUND,"variantId is empty");
       }
        ProductVariant variant=  variantRepo.findById(request.getVariantId()).orElseThrow(()->new ResponseStatusException(HttpStatus.NOT_FOUND,"this variant is not available"));

        ensureOwnership(userMail, request.getVariantId(),productId);

        if(request.getQty()==null ||request.getQty()<1){
          return   removeItem(userMail,productId,request.getVariantId());

        }
        Cart cart=getOrCreateCart(userMail);
        CartItem item=itemsRepo.findByCart_IdAndVariant_Id(cart.getId(), request.getVariantId()).orElseThrow(()->new ResponseStatusException(HttpStatus.NOT_FOUND,"Item Not Found"));

      int Allowed =Math.
              min(variant.getStock(), MAX_QTY_PER_ITEM);

      item.setQuantity( Math.min(request.getQty(), Allowed));
       cart.recalcTotals();
      cartRepo.save(cart);
      return ResponseEntity.ok().body(toResponse(cart));
    }
    @Transactional
       public ResponseEntity<CartResponse> removeItem(String userMail ,long productId ,Long variantId){
        ensureOwnership(userMail, variantId,productId);
        Cart cart =getOrCreateCart(userMail);
        CartItem item=itemsRepo.findByCart_IdAndVariant_Id(cart.getId(),variantId).orElseThrow(() ->new ResponseStatusException(HttpStatus.NOT_FOUND,"Item Not Found"));
        cart.getItems().remove(item);
        cart.recalcTotals();
        cartRepo.save(cart);
        return  ResponseEntity.ok().body(toResponse(cart));
       }
       @Transactional
       public  void clearCart(String userMail){
       Cart cart =getOrCreateCart(userMail);
       cart.getItems().clear();
       cart.recalcTotals();
       cartRepo.save(cart);

       }

    public Cart getOrCreateCart(String userMail) {

        return cartRepo.findCartByUserEmail(userMail).orElseGet(() -> {
            User user =  userRepo.findByEmail(userMail).orElseThrow(()-> new ResponseStatusException(HttpStatus.NOT_FOUND, "User Not Found"));
            Cart c = new Cart();
            c.setUser(user);
            return cartRepo.save(c);
        });


    }
    private CartResponse toResponse(Cart cart) {
       List<CartItem>cartItems=cart.getItems();
       List<Long> productIds=cartItems
               .stream().map(ci->
                       ci.getVariant().getProduct()
                               .getId()).toList();
       List<String>colors=cartItems.stream().map(CartItem::getColor).distinct().toList();

        Map<String,String> getPrimaryImageMap=imageRepo.findPrimaryImage (productIds,colors)
                .stream().collect(Collectors.
                        toMap(pi-> pi.getProduct().getId()+"_"+pi.getColor(),ProductImage::getImageUrl ));

        List<CartItemResponse> items=cartItems.stream().map(ci->

                new CartItemResponse(
                        ci.getId(),
                        ci.getVariant().getProduct().getId(),
                        ci.getVariant().getId(),
                        ci.getVariant().getProduct().getName(),
                        getPrimaryImageMap.get(ci.getVariant().getProduct().getId()+"_"+ci.getColor()),
                        ci.getUnitPrice(),
                        ci.getColor(),
                        ci.getSize(),
                        ci.getQuantity()


                )).toList();
        return new CartResponse(
               cart.getId(),
               items,
               cart.getSubtotal()==null?BigDecimal.ZERO:cart.getSubtotal(),
               "INR"
       );


    }
    private void ensureOwnership(String userMail,  Long variantId, Long productId){

       Cart cart=getOrCreateCart(userMail);

       CartItem item=itemsRepo.findByCart_IdAndVariant_Id(cart.getId(),variantId).orElseThrow(()->new ResponseStatusException(HttpStatus.NOT_FOUND,"Item Not Found"));
      if(! item.getVariant().getProduct().getId().equals(productId)){
          throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"this variant not belongs to this product");
      }
//System.out.println(cart.getId()+" ."+item.getCart().getId());

    }
}