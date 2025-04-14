package com.example.pusherbeams.services;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@Service
public class PusherService {

    private static final String PUSHER_BEAMS_URL = "https://api.pushnotifications.pusher.com/publish_api/v1/instances/{instanceId}/publishes";

    private final WebClient webClient;

    @Value("${pusher.beams.instanceId}")
    private String instanceId;

    @Value("${pusher.beams.secretKey}")
    private String secretKey;

    public PusherService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.baseUrl(PUSHER_BEAMS_URL).build();
    }

    public void sendNotification(String userId, String message) {
        // Construire le payload avec le format attendu
        String jsonPayload = "{"
                + "\"interests\": [\"" + userId + "\"],"
                + "\"fcm\": {"
                + "\"notification\": {"
                + "\"title\": \"New Notification\","
                + "\"body\": \"" + message + "\""
                + "}"
                + "}"
                + "}";

        // Effectuer la requête HTTP POST
        webClient.post()
                .uri(uriBuilder -> uriBuilder
                        .path("/v1/instances/{instanceId}/publishes")
                        .build(instanceId))  // Utilisation de instanceId provenant des propriétés
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + secretKey)
                .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .bodyValue(jsonPayload)
                .retrieve()
                .onStatus(status -> status.is4xxClientError() || status.is5xxServerError(),
                        response -> Mono.error(new RuntimeException("HTTP error: " + response.statusCode())))
                .bodyToMono(String.class)
                .doOnTerminate(() -> System.out.println("Notification sent"))
                .doOnError(e -> System.err.println("Error sending notification: " + e.getMessage()))
                .subscribe();
    }
}
