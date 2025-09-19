package com.E_commerce.repo;
import com.E_commerce.modal.CartItems;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CartItemsRepo extends JpaRepository<CartItems,Long> {
    Optional<CartItems> findByCart_IdAndProduct_Id(Long cartId,long productId);



}
