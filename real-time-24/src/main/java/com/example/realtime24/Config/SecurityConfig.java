package com.example.realtime24.Config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())  // CSRF désactivé
               /* .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/ws/**").permitAll() // Autoriser WebSocket pour tous
                        .anyRequest().authenticated() // Autres endpoints nécessitent authentification
                );*/

                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/ws/**", "/api/orders/**", "/notify/**").permitAll()
                        .anyRequest().authenticated()
                );




        return http.build();
    }






}


