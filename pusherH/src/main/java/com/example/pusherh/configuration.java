package com.example.pusherh;



import com.pusher.rest.Pusher;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class configuration implements WebMvcConfigurer {

    // Configuration CORS pour autoriser les requêtes depuis votre frontend Angular
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        // Définir les règles CORS globales
        registry.addMapping("/**")                    // Autoriser toutes les routes de l'API
                .allowedOrigins("http://localhost:4200") // Spécifier l'URL de votre frontend Angular
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // Méthodes HTTP autorisées
                .allowedHeaders("*")                   // Autoriser tous les headers
                .allowCredentials(true);               // Autoriser les cookies si nécessaire
    }

    @Bean
    public Pusher pusher() {
        String appId = "1963051";  // Remplace par ton ID d'application Pusher
        String key = "5c434c2523cf909f4c29";       // Remplace par ta clé d'application Pusher
        String secret = "a0329d253856e9cb25ed"; // Remplace par ton secret d'application Pusher
        String cluster = "eu"; // Remplace par le cluster de ton application Pusher

        Pusher pusher = new Pusher(appId, key, secret);
        pusher.setCluster(cluster);
        pusher.setEncrypted(true);
        return pusher;
    }
}