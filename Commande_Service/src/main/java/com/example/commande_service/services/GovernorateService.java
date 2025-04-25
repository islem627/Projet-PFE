package com.example.commande_service.services;


import com.example.commande_service.entities.GovernorateEntity;
import com.example.commande_service.repositories.GovernorateRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class GovernorateService {

    @Autowired
    private GovernorateRepo governorateRepo;

    public List<String> getGovernorates() {
        return governorateRepo.findAll()
                .stream()
                .map(GovernorateEntity::getName)
                .collect(Collectors.toList());
    }
}