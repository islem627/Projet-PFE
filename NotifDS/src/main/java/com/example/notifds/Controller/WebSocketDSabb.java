package com.example.notifds.Controller;


import com.example.notifds.WebSocketDTO.SubscriptionMessage;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Controller;

import java.util.Map;

@Controller
public class WebSocketDSabb  {

    @MessageMapping("/subscribe")
    public void handleSubscription(@Payload SubscriptionMessage message) {
        String event = message.getEvent();
        Map<String, String> data = message.getData();
        String channel = data.get("channel");

        if ("bts:subscribe".equals(event)) {
            System.out.println("Abonnement au canal : " + channel);
            // Traitez l'abonnement ici (par exemple, enregistrez l'utilisateur dans le canal).
        }
    }
}