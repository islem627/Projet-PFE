package com.example.realtime24.controller;


public class OrderUpdate {

    private String id_commande;
    private String status;

    // Getters and Setters
    public String getOrderId() {
        return id_commande;
    }

    public void setOrderId(String id_commande) {
        this.id_commande = id_commande;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
