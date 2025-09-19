package com.E_commerce.repo;

import com.E_commerce.modal.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProductRepo extends JpaRepository<Product,Long> {


   Optional  < Product> findById(long id);

}
