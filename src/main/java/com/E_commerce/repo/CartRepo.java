package com.E_commerce.repo;

import com.E_commerce.dto.CartDetailsDto;
import com.E_commerce.dto.CartItemResponse;
import com.E_commerce.modal.Cart;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CartRepo extends JpaRepository<Cart,Integer> {

 @EntityGraph(attributePaths ={
         "items",
         "user",
         "items.variant",
         "items.variant.product"
 })
 Optional<Cart>  findCartByuserId(  long userId);

 @Query("""
    SELECT new com.E_commerce.dto.CartItemResponse(
        ci.id,
        p.id,
        v.id,
        p.name,
        pi.imageUrl,
        ci.unitPrice,
        ci.color,
        ci.size,
        ci.quantity
        
    )
    FROM CartItem ci
    JOIN ci.cart c
    JOIN c.user u
    JOIN ci.variant v
    JOIN v.product p
    LEFT JOIN ProductImage pi
        ON pi.product = p
       AND pi.color = ci.color
       AND pi.isPrimary = true
    WHERE u.email = :email
""")
 List<CartItemResponse> findCartItems(String email);
 @Query("""
    SELECT new com.E_commerce.dto.CartDetailsDto(
        c.id,
        COALESCE(c.subtotal, 0),
        'INR'
    )
    FROM Cart c
    JOIN c.user u
    WHERE u.email = :email
""")
Optional <CartDetailsDto> findCartDetails(@Param("email") String email);

 @EntityGraph(attributePaths ={
         "items",
         "user",
         "items.variant",
         "items.variant.product"
 })
 Optional<Cart> findCartByUserEmail(String email);
}
