package com.example.realtime24.Config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.web.socket.server.support.DefaultHandshakeHandler;

import java.security.Principal;
import java.util.List;
import java.util.Map;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        config.enableSimpleBroker("/topic", "/queue");
        config.setApplicationDestinationPrefixes("/app");
        config.setUserDestinationPrefix("/user");
    }


    @Override
    public void configureClientInboundChannel(ChannelRegistration registration) {
        registration.interceptors(new ChannelInterceptor() {
            @Override
            public Message<?> preSend(Message<?> message, MessageChannel channel) {
                StompHeaderAccessor accessor = StompHeaderAccessor.wrap(message);
                // Utiliser getHeader pour accéder à l'en-tête Authorization
                String authorizationHeader = accessor.getHeader("Authorization") != null
                        ? accessor.getHeader("Authorization").toString() : "None";
                System.out.println("📡 WebSocket Authorization header: " + authorizationHeader);
                System.out.println("📡 User: " + (accessor.getUser() != null ? accessor.getUser().getName() : "Anonymous"));
                System.out.println("📡 Destination: " + accessor.getDestination());
                return message;
            }
        });
    }

            /*
    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws")
                .setAllowedOrigins("http://localhost:4200")
                .withSockJS();
    }*/


    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws")
                .setHandshakeHandler(new DefaultHandshakeHandler() {

                    @Override
                    protected Principal determineUser(ServerHttpRequest request,
                                                      WebSocketHandler wsHandler,
                                                      Map<String, Object> attributes) {
                        List<String> authHeaders = request.getHeaders().get("Authorization");
                        if (authHeaders != null && !authHeaders.isEmpty()) {
                            String token = authHeaders.get(0).replace("Bearer ", "");
                            try {
                                // Replace with your actual JWT secret key
                                String secretKey = "MA_SUPER_CLE_SECRET";

                                Claims claims = Jwts.parser()
                                        .setSigningKey(secretKey.getBytes())
                                        .parseClaimsJws(token)
                                        .getBody();

                                String username = claims.getSubject();
                                return () -> username; // Used as the Principal
                            } catch (Exception e) {
                                System.out.println("❌ Erreur parsing token : " + e.getMessage());
                            }
                        }
                        return null;
                    }
                })
                .setAllowedOrigins("*"); // Optional: allow cross-origin requests
    }
}