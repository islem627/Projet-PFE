package com.example.pushernotif.controller;

import com.example.pushernotif.services.PusherService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "*") // Permettre Angular d'accéder
public class NotificationController {

    private final PusherService pusherService;

    public NotificationController(PusherService pusherService) {
        this.pusherService = pusherService;
    }

    @PostMapping("/send")
    public String sendNotification(@RequestParam String message) {
        pusherService.triggerNotification(message);
        return "Notification envoyée !";
    }
}