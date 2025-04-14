package com.example.commande_service.services;
import com.example.commande_service.entities.CommandeEntity;
import com.example.commande_service.repositories.CommandeRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
@Service
public class CommandeService {
    @Autowired
    CommandeRepo commandeRepo;
    public CommandeEntity create (CommandeEntity commandeEntity)
    {
        return commandeRepo.save(commandeEntity);
    }
    public CommandeEntity one_commande (Long id_commande){ return commandeRepo.findById(id_commande).orElse(null);
    }
    public List<CommandeEntity> GetAll (){
        return commandeRepo.findAll();
    }
    public  void  Delete (Long id_commande){ commandeRepo.deleteById(id_commande);
    }
    public CommandeEntity  update(CommandeEntity commandeEntity)
    {
        return commandeRepo.save(commandeEntity);
    }


    public List<CommandeEntity> alltasksbyIdproduct(Long id){return commandeRepo.findAllByProject_Id(id);}
     public List<CommandeEntity> alltasksbyIduser(Long id){return  commandeRepo.findAllByUser_Id(id);}

}