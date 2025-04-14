package com.example.realtime24.controller;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class OrderNotificationController {

    @MessageMapping("/order/status") // Endpoint to receive updates
    @SendTo("/topic/order") // Broadcast updates to all subscribers
    public OrderUpdate sendOrderUpdate(OrderUpdate orderUpdate) {
        System.out.println("Order ID: " + orderUpdate.getOrderId() + " - Status: " + orderUpdate.getStatus());
        return orderUpdate; // Send the order update to the subscribers
    }
}
