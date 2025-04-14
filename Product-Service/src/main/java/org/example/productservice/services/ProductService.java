package org.example.productservice.services;


import org.example.productservice.entities.ProductEntity;
import org.example.productservice.repositories.ProductRepo;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ProductService {
    @Autowired
    ProductRepo productRepo;


   public ProductService() {

   }

    public ProductEntity create(ProductEntity productEntity) {
        return productRepo.save(productEntity);
    }

    public ProductEntity update(ProductEntity productEntity) {
        return productRepo.save(productEntity);
    }


    public ProductEntity oneProduct(Long id) {
        return productRepo.findById(id).orElse(null);
    }


    public List<ProductEntity> getAll() {
        return productRepo.findAll();
    }


    public void delete(Long id) {
        productRepo.deleteById(id);
    }
    public ProductEntity getProductById(Long id) {

        return productRepo.findById(id).orElse(null);

    }



}