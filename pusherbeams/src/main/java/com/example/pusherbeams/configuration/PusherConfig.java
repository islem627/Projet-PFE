package com.example.pusherbeams.configuration;


import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
public class PusherConfig {

    @Value("${pusher.beams.instanceId}")
    private String instanceId;

    @Value("${pusher.beams.secretKey}")
    private String secretKey;

    // Getters pour instanceId et secretKey
    public String getInstanceId() {
        return instanceId;
    }

    public String getSecretKey() {
        return secretKey;
    }
}
