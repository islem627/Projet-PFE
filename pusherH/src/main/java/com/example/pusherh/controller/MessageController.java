package com.example.pusherh.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.pusher.rest.Pusher;

@RestController
@RequestMapping("/api")
public class MessageController {

    @Autowired
    private Pusher pusher;

    // Configurez Pusher (Assurez-vous d'avoir installé la dépendance Pusher)
    public Pusher getPusher() {
        Pusher pusher = new Pusher("YOUR_APP_ID", "YOUR_KEY", "YOUR_SECRET");
        pusher.setCluster("YOUR_CLUSTER");
        return pusher;
    }

    @PostMapping("/send-message")
    public String sendMessage(@RequestParam String message) {
        // Vous pouvez effectuer une action sur le message ici
        // Par exemple, envoyer l'événement à Pusher
        try {
            getPusher().trigger("my-channel", "my-event", message);
            return "Message sent: " + message;
        } catch (Exception e) {
            return "Error sending message: " + e.getMessage();
        }
    }
    /*
    @PostMapping("/api/send-message")
    public String sendMessage(@RequestParam String message) {
        // Envoi de l'événement à Pusher
        pusher.trigger("my-channel", "my-event", message);
        return "Message sent: " + message;
    }

     */
}
