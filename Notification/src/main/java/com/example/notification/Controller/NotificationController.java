package com.example.notification.Controller;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class NotificationController {

    @MessageMapping("/sendNotification") // Route pour recevoir les messages du client
    @SendTo("/topic/notifications") // Envoyer à tous les abonnés
    public String sendNotification(String message) {
        return "Notification: " + message;
    }
}