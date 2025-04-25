package com.example.realtime24.controller;

import com.example.realtime24.DTO.CommandeDTO;

public class OrderUpdate {
    private String orderId;
    private String status;
    private CommandeDTO commandeDTO;

    // Getters and setters
    public String getOrderId() { return orderId; }
    public void setOrderId(String orderId) { this.orderId = orderId; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public CommandeDTO getCommandeDTO() { return commandeDTO; }
    public void setCommandeDTO(CommandeDTO commandeDTO) { this.commandeDTO = commandeDTO; }

    @Override
    public String toString() {
        return "OrderUpdate{orderId='" + orderId + "', status='" + status + "', commandeDTO=" + commandeDTO + "}";
    }
}