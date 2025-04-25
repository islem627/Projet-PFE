package com.example.commande_service.DTO;


import java.time.LocalDate;

public class ProductDTO {
    private Long id;
    private String name;
    private String description;
    private Double price;
    private LocalDate dateAdded;  // Changed from Date to LocalDate
    private String photo;
    private String type;
    private boolean disponiblity ;
    private int quantity;

    public ProductDTO() {
    }

    public ProductDTO(Long id, String name, String description, Double price, LocalDate dateAdded, String photo, String type) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.price = price;
        this.dateAdded = dateAdded;
        this.photo = photo;
        this.type = type;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public LocalDate getDateAdded() {
        return dateAdded;
    }

    public void setDateAdded(LocalDate dateAdded) {
        this.dateAdded = dateAdded;
    }

    public String getPhoto() {
        return photo;
    }

    public void setPhoto(String photo) {
        this.photo = photo;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

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
