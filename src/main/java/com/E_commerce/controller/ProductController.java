package com.E_commerce.controller;
import com.E_commerce.dto.ProductResponse;
import com.E_commerce.modal.Product;
import com.E_commerce.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@RestController
@RequestMapping("/api/products")
public class ProductController {
    @Autowired
    private ProductService service;
    @GetMapping
    public ResponseEntity<List<ProductResponse>> getProducts(){
        return service.getProducts();
    }
    @GetMapping ("/{productId}")
    public ResponseEntity<ProductResponse> getProductById(@PathVariable Long productId){
        return service.getProductById(productId);
    }
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/admin/product/add")
    public ResponseEntity<ProductResponse>  addProduct(@RequestBody Product product) {

        return service.addProduct(product);
    }
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/admin/product/delete/{productId}")
    public  String deleteProduct( @PathVariable  long productId){
        return  service.deleteProduct(productId);
    }
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/admin/product/update/{productId}")
    public  ResponseEntity<ProductResponse> updateProduct(@PathVariable Long productId, @RequestBody Product product){
        return service.updateProduct(productId,product);
    }

}

