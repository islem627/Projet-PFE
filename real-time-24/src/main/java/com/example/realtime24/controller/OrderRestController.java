package com.example.realtime24.controller;

import com.example.realtime24.DTO.CommandeDTO;
import com.example.realtime24.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "http://localhost:4200", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS}, allowCredentials = "true")
public class OrderRestController {

    @Autowired
    private OrderService orderService;

   /* @PutMapping("/update/{id}")
    public ResponseEntity<?> updateOrderStatus(@PathVariable String id, @RequestBody CommandeDTO commandeDTO) {
        try {
            orderService.updateOrderStatus(id, commandeDTO.getStatut_commande());
            return ResponseEntity.ok("Statut mis à jour avec succès");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erreur lors de la mise à jour: " + e.getMessage());
        }
    }

    */

    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateOrderStatus(@PathVariable String id, @RequestBody CommandeDTO commandeDTO) {
        try {
            orderService.updateOrderStatus(id, commandeDTO.getStatut_commande());
            return ResponseEntity.ok("Statut mis à jour avec succès");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erreur lors de la mise à jour: " + e.getMessage());
        }
    }

}