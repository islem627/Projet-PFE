package com.example.commande_service.openfile;

import com.example.commande_service.DTO.ProductDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "product-service", url = "http://localhost:8763")

public interface Client_produit {

    @GetMapping("/product/getOne/{id}")
    public ProductDTO getProduct(@PathVariable Long id);


}
