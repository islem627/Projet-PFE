package com.example.pushernotif.services;


import com.pusher.rest.Pusher;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class PusherService {
    private final Pusher pusher;

    public PusherService(
            @Value("${pusher.app.id}") String appId,
            @Value("${pusher.key}") String key,
            @Value("${pusher.secret}") String secret,
            @Value("${pusher.cluster}") String cluster) {

        this.pusher = new Pusher(appId, key, secret);
        this.pusher.setCluster(cluster);
        this.pusher.setEncrypted(true);
    }

    public void triggerNotification(String message) {
        Map<String, String> data = new HashMap<>();
        data.put("message", message);

        pusher.trigger("notification-channel", "new-notification", data);
    }
}