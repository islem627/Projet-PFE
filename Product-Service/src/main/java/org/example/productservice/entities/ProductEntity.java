package org.example.productservice.entities;

import jakarta.persistence.*;

import java.time.LocalDate;

@Entity

public class ProductEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String description;
    private Double price;

    private String type;

    @Temporal(TemporalType.DATE)
    private LocalDate dateAdded ;
    private  String photo ;
    private boolean disponiblity ;
    private int quantity;
    public ProductEntity() {
    }

    public ProductEntity(Long id, String name, String description, Double price, String type, LocalDate dateAdded, String photo) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.price = price;
        this.type = type;
        this.dateAdded = dateAdded;
        this.photo = photo;
    }

    public Long getId() {return id;}

    public void setId(Long id) {this.id = id;}

    public String getName() {return name;}
    public void setName(String name) {this.name = name;}

    public String getDescription() {return description;}
    public void setDescription(String description) {this.description = description;}

    public Double getPrice() {return price;}
    public void setPrice(Double price) {this.price = price;}

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public LocalDate getDateAdded() {
        return dateAdded;
    }

    public void setDateAdded(LocalDate dateAdded) {
        this.dateAdded = dateAdded;
    }
    public String getPhoto() {return photo;}
    public void setPhoto(String photo) {this.photo = photo;}

    public boolean isDisponiblity() {
        return disponiblity;
    }

    public void setDisponiblity(boolean disponiblity) {
        this.disponiblity = disponiblity;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }
}




