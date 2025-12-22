package com.E_commerce.repo;

import com.E_commerce.modal.ProductVariant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductVariantRepo extends JpaRepository<ProductVariant,Long> {
}
