package com.example.realtime24.controller;

import com.example.realtime24.DTO.CommandeDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
/*
@Controller
public class OrderNotificationController {

    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate;

    @MessageMapping("/order/status")
    public void sendOrderUpdate(OrderUpdate orderUpdate) {
     /*   String clientId = String.valueOf(orderUpdate.getCommandeDTO().getIduser());
        String destination = "/user/" + clientId + "/queue/order";
*/

   /*     String clientId = String.valueOf(orderUpdate.getCommandeDTO().getIduser());
        String destination = "/user/" + clientId + "/queue/order";
        simpMessagingTemplate.convertAndSend(destination, orderUpdate);

        System.out.println("📥 Message reçu pour /app/order/status: " + orderUpdate);
        System.out.println("👉 Envoi notification à l'utilisateur ID: " + clientId);
        System.out.println("Commande ID: " + orderUpdate.getOrderId() + ", Statut: " + orderUpdate.getStatus());
        System.out.println("Destination: " + destination);

        try {
            simpMessagingTemplate.convertAndSend(destination, orderUpdate);
            System.out.println("✅ Notification envoyée avec succès à " + destination);
        } catch (Exception e) {
            System.err.println("❌ Erreur lors de l'envoi de la notification: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
*/




@Controller
public class OrderNotificationController {

    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate;

    @MessageMapping("/order/status")
    public void sendOrderUpdate(OrderUpdate orderUpdate) {
        String clientId = String.valueOf(orderUpdate.getCommandeDTO().getIduser());
        String destination = "/user/" + clientId + "/queue/order";
        simpMessagingTemplate.convertAndSend(destination, orderUpdate);

        System.out.println("✅ Notification envoyée à: " + destination);
    }
}
