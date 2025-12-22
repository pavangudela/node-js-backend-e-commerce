package com.E_commerce.repo;

import com.E_commerce.modal.ProductImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;


@Repository
public interface ProductImageRepo extends JpaRepository< ProductImage,Long> {

    @Query("""
            SELECT pi
            from ProductImage pi
            where pi.product.id IN :productIds
            AND pi.color IN :colors
            AND pi.isPrimary=true
            """)
    List<ProductImage> findPrimaryImage(List<Long> productIds, List<String> colors);


}
