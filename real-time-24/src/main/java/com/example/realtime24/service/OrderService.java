package com.example.realtime24.service;

import com.example.realtime24.entity.Commande;
import com.example.realtime24.repository.CommandeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class OrderService {

    @Autowired
    private CommandeRepository commandeRepository;

    public void updateOrderStatus(String id, String status) {
        Commande commande = commandeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Commande introuvable avec l'ID: " + id));
        commande.setStatut_commande(status);
        commandeRepository.save(commande);
        System.out.println("Mise à jour du statut de la commande " + id + " à " + status);
    }
}