package com.example.websocketpush.controller;

import com.example.websocketpush.service.WebSocketPushService;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/notifications")
public class WebSocketPushController {

    private final WebSocketPushService notificationService;

    public WebSocketPushController(WebSocketPushService notificationService) {
        this.notificationService = notificationService;
    }

    @PostMapping("/send")
    public void sendNotification(@RequestParam String message) {
        notificationService.sendNotification(message);
    }

    @MessageMapping("/sendMessage") // Endpoint STOMP
    @SendTo("/topic/notifications")
    public String handleMessage(String message) {
        return "Nouvelle notification : " + message;
    }
}
