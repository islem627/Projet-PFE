package com.example.notifds.service;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
public class WebSocketDSService {

        @Autowired
        private SimpMessagingTemplate messagingTemplate;

        public void sendNotification(String message) {
            messagingTemplate.convertAndSend("/topic/notifications", message);
        }
    }
