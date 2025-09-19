package com.E_commerce.service;

import com.E_commerce.modal.Product;
import com.E_commerce.repo.ProductRepo;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class ProductService {
    @Autowired
    private ProductRepo repo;

    public List<Product> getProducts() {
        return repo.findAll();
    }

    public ResponseEntity<Product> addProduct(Product product) {
        System.out.println(product);
         repo.save(product);
         return ResponseEntity.ok(product);
    }

    public String deleteProduct(long productId) {
     repo.delete( repo.findById(productId).orElseThrow(()->new ResponseStatusException(HttpStatus.NOT_FOUND,"Product Not Found")));

        return  "deleted";
    }

    public ResponseEntity<Product> updateProduct(Long productId, @NotNull  Product product) {
        if(productId==0){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"product Id is Empty");
        }
   product.setId(productId);
        repo.save(product);
        return ResponseEntity.ok(product);
    }

    public ResponseEntity<Product> getProductById(Long productId) {


                Product product=repo.findById(productId).orElseThrow(()->new ResponseStatusException(HttpStatus.NOT_FOUND,"product not found"));
                return ResponseEntity.ok(product);
    }
}
