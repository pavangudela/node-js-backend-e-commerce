package com.E_commerce.repo;
import com.E_commerce.modal.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CartItemRepo extends JpaRepository<CartItem,Long> {
    Optional<CartItem> findByCart_IdAndVariant_Id(Long cartId, long variantId);

    @Modifying
    @Query("DELETE FROM CartItem ci Where ci.cart.id=:cartId")
    void deleteByCartId(Long cartId);



}
