package com.example.commande_service.openfile;


import com.example.commande_service.DTO.UserDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "user-service", url = "http://localhost:8762")
    public interface Commande_user {

        @GetMapping("/User/getuser/{id}")
        public UserDTO getUser(@PathVariable Long id);
    }


