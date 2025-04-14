package com.example.commande_service.repositories;

import com.example.commande_service.entities.CommandeEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository

    public interface CommandeRepo extends JpaRepository<CommandeEntity, Long> {
    @Query("SELECT t FROM CommandeEntity t WHERE t.idproduit = :id")
    public List<CommandeEntity> findAllByProject_Id(Long id);
    @Query("SELECT i FROM CommandeEntity i WHERE i.iduser = :id")
    public List<CommandeEntity>findAllByUser_Id(Long id);


    }
