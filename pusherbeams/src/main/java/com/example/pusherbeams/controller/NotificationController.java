package com.example.pusherbeams.controller;

import com.example.pusherbeams.request.NotificationRequest;
import com.example.pusherbeams.services.PusherService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/notifications")
public class NotificationController {

    @Autowired
    private PusherService pusherService;

    // Méthode pour envoyer une notification
    @PostMapping("/send")
    public void sendNotification(@RequestBody NotificationRequest notificationRequest) {
        pusherService.sendNotification(notificationRequest.getUserId(), notificationRequest.getMessage());
    }
}
