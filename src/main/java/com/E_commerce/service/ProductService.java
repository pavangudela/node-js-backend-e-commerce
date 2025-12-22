package com.E_commerce.service;

import com.E_commerce.dto.ImageDto;
import com.E_commerce.dto.ProductResponse;
import com.E_commerce.dto.ProductVariantResponse;
import com.E_commerce.modal.Product;
import com.E_commerce.modal.ProductImage;
import com.E_commerce.modal.ProductVariant;
import com.E_commerce.repo.ProductRepo;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ProductService {
    @Autowired
    private ProductRepo repo;

    public ResponseEntity<List<ProductResponse>> getProducts() {

        return ResponseEntity.ok(repo.findAll().stream().map(this::toResponse).toList()) ;
    }

    public ResponseEntity<ProductResponse> addProduct(Product product) {
        System.out.println(product);
         repo.save(product);
         return ResponseEntity.ok(toResponse(product));
    }

    public String deleteProduct(long productId) {
     repo.delete( repo.findById(productId).orElseThrow(()->new ResponseStatusException(HttpStatus.NOT_FOUND,"Product Not Found")));

        return  "product deleted successfully";
    }

    public ResponseEntity<ProductResponse> updateProduct(Long productId,  Product product) {
        if(productId==0){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"product Id is Empty");
        }
   product.setId(productId);
        repo.save(product);
        return ResponseEntity.ok(toResponse(product));
    }

    public ResponseEntity<ProductResponse> getProductById(Long productId) {


                Product product=repo.findById(productId).orElseThrow(()->new ResponseStatusException(HttpStatus.NOT_FOUND,"product not found"));
                return ResponseEntity.ok(toResponse(product));
    }


    public ProductResponse toResponse(Product product){

        Map<String,List<ImageDto>> imagesByColor=
                product.getImages().stream().collect(Collectors
                        .groupingBy(ProductImage::getColor,
                                Collectors.mapping(
                                        img-> new ImageDto(
                                                img.getImageUrl(),
                                                img.isPrimary()
                                        ),
                                        Collectors.toList()


                )));

     List<ProductVariantResponse> variants=product.getVariants().stream().map(
             variant-> new ProductVariantResponse(
                     variant.getId(),
                     variant.getColor(),
                     variant.getSize(),
                     variant.getStock()
             )
     ).toList();
      return  new ProductResponse(
                product.getId(),
                product.getName(),
                product.getDescription(),
                product.getCategory(),
                product.getPrice(),
                imagesByColor,
                variants

        );

    }
}
