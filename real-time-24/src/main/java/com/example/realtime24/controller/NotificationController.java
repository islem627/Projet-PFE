package com.example.realtime24.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@RestController


public class NotificationController {

    //server application
    ///app/sendMessage
    ///app/sendMessage
    @MessageMapping("/sendMessage")
    @SendTo("/topic/notifications")
   /*public String sendMessage(String message){
        System.out.println("message : "+message);
        return message;
    }*/

    public String sendMessage(String message){
        return message;
    }

    private final SimpMessagingTemplate messagingTemplate;

    @Autowired
    public NotificationController(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

/*
    @PostMapping("/notify/{username}")
    public void sendNotification(@PathVariable String username, @RequestBody String message) {
        messagingTemplate.convertAndSendToUser(username, "/queue/notify", message);
    }

 */
@PostMapping("/notify/{username}")
public void sendNotification(@PathVariable String username, @RequestBody String message) {
    System.out.println("📢 Sending to " + username + ": " + message);
    messagingTemplate.convertAndSendToUser(username, "/queue/notify", message);
}


}
