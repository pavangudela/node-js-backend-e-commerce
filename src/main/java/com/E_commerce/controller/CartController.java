package com.E_commerce.controller;
import com.E_commerce.dto.AddItemRequest;
import com.E_commerce.dto.CartResponse;
import com.E_commerce.modal.JwtUserAccessor;
import com.E_commerce.dto.UpdateItemRequest;
import com.E_commerce.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@PreAuthorize("hasRole('CUSTOMER')")
public class CartController {
    @Autowired
    private JwtUserAccessor jwtUser;

    @Autowired
    private CartService cartService;

    @GetMapping
    public ResponseEntity<CartResponse> getCart(){

        return cartService.getMyCart(jwtUser.getMail());
    }

    @PostMapping("/item")
     public ResponseEntity<CartResponse> addItem(@RequestBody AddItemRequest request){
         return cartService.addItem(jwtUser.getMail(),request.getProductId(),request.getQty());
     }
     @PatchMapping("/item/{itemId}")
    public ResponseEntity<CartResponse> updateQty(@PathVariable long itemId, @RequestBody UpdateItemRequest request){
        System.out.println(itemId+"    . "+request.getQty());
        return cartService.updateQuantity(jwtUser.getMail(), itemId, request.getQty());
     }
@DeleteMapping("/item/{itemId}")
    public ResponseEntity<CartResponse>  removeItem(@PathVariable long itemId ){

    return   cartService.removeItem(jwtUser.getMail(), itemId);

}
@DeleteMapping
    public void clearCart(){
        cartService.clearCart(jwtUser.getMail());
}


}
