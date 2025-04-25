package org.example.productservice.repositories;

import org.example.productservice.entities.ProductEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository

public interface  ProductRepo extends  JpaRepository<ProductEntity, Long> {
        }