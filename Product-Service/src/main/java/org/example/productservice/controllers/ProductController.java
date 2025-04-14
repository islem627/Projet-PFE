package org.example.productservice.controllers;

import org.example.productservice.DTO.ProductDTO;
import org.example.productservice.services.ProductService;
import org.example.productservice.services.StorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.example.productservice.entities.ProductEntity;
import org.springframework.web.multipart.MultipartFile;


import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/product")
@CrossOrigin(origins = "http://localhost:4200")

public class ProductController {
    @Autowired
    ProductService productService;

    @Autowired
    StorageService storageService;

    public ProductController() {}




    @PostMapping("/create")
    public ProductDTO addProduct(@RequestBody ProductDTO productDTO) {
        ProductEntity productEntity = ProductDTO.toEntity(productDTO);
        ProductEntity savedProduct = productService.create(productEntity);
        return ProductDTO.fromEntity(savedProduct);
    }

    @PostMapping("/createPhoto")
    public ProductDTO addProductPhoto(
            ProductEntity p ,
            @RequestParam("file") MultipartFile file) {


        //LocalDate parsedDate = LocalDate.parse(p.getDateAdded());


        String namephoto = storageService.store(file);

        // Create ProductDTO manually
        ProductDTO productDTO = new ProductDTO();
        productDTO.setName(p.getName());
        productDTO.setDescription(p.getDescription());
        productDTO.setPrice(p.getPrice());
        //productDTO.setDateAdded(parsedDate);
        productDTO.setType(p.getType());
        productDTO.setQuantity(p.getQuantity());
        productDTO.setDisponiblity(p.isDisponiblity());
        productDTO.setPhoto(namephoto);

        // Save product
        ProductEntity productEntity = ProductDTO.toEntity(productDTO);
        ProductEntity savedProduct = productService.create(productEntity);

        return ProductDTO.fromEntity(savedProduct);
    }





    @GetMapping("/getall")
    public List<ProductDTO> getAll() {
        return productService.getAll().stream().map(ProductDTO::fromEntity).toList();
    }


    @GetMapping("/getOne/{id}")
    public ProductDTO getProduct(@PathVariable Long id) {
        ProductEntity product = productService.oneProduct(id);
        return product != null ? ProductDTO.fromEntity(product) : null;
    }


    @PutMapping("/updateProduct/{id}")
    public ProductDTO updateProduct(@PathVariable Long id, @RequestBody ProductDTO productDTO) {
        ProductEntity existingProduct = productService.oneProduct(id);
        if (existingProduct == null) {
            return null;
        }

        // Update only non-null fields
        if (productDTO.getName() != null) existingProduct.setName(productDTO.getName());
        if (productDTO.getDescription() != null) existingProduct.setDescription(productDTO.getDescription());
        if (productDTO.getPrice() != null) existingProduct.setPrice(productDTO.getPrice());
        if (productDTO.getDateAdded() != null) existingProduct.setDateAdded(productDTO.getDateAdded());
        if (productDTO.getPhoto() != null) existingProduct.setPhoto(productDTO.getPhoto());
        if (productDTO.getType() != null) existingProduct.setType(productDTO.getType());
        if (productDTO.getQuantity() != 0) existingProduct.setQuantity(productDTO.getQuantity());
        if (productDTO.isDisponiblity()) existingProduct.setDisponiblity(productDTO.isDisponiblity());

        ProductEntity updatedProduct = productService.update(existingProduct);
        return ProductDTO.fromEntity(updatedProduct);
    }
    @GetMapping("/files/{filename:.+}")
    @ResponseBody
    public ResponseEntity<Resource> getFile(@PathVariable String filename) {
        Resource file = storageService.loadFile(filename);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + file.getFilename() + "\"")
                .body(file);
    }

    @DeleteMapping("/delete/{id}")
    public void delete(@PathVariable Long id) {
        productService.delete(id);
    }



}
