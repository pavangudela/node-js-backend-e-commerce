package com.E_commerce.repo;

import com.E_commerce.modal.Cart;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CartRepo extends JpaRepository<Cart,Integer> {

 Optional<Cart>  findCartByuserId(  long userId);
}
