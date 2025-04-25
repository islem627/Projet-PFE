package com.example.commande_service.repositories;


import com.example.commande_service.entities.GovernorateEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GovernorateRepo extends JpaRepository<GovernorateEntity, Long> {
}