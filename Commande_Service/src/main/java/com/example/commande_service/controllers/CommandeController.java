package com.example.commande_service.controllers;

import com.example.commande_service.DTO.CommandeDTO;
import com.example.commande_service.DTO.ProductDTO;
import com.example.commande_service.DTO.UserDTO;
import com.example.commande_service.entities.CommandeEntity;
import com.example.commande_service.openfile.Client_produit;
import com.example.commande_service.openfile.Commande_user;
import com.example.commande_service.repositories.CommandeRepo;
import com.example.commande_service.services.CommandeService;
import feign.FeignException;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/Commande")
@CrossOrigin(origins = "http://localhost:4200")


public class CommandeController {

    @Autowired
    CommandeService commandeService;

@Autowired
Client_produit client_product;
@Autowired
    Commande_user commande_user;
    @Autowired
    private CommandeRepo commandeRepo;


    // ✅ Créer une nouvelle commande
    @PostMapping("/create/{idproduit}")
    public CommandeDTO addCommande(CommandeEntity commandeEntity,@PathVariable Long idproduit) {


        ProductDTO productDTO =client_product.getProduct(idproduit);




        CommandeEntity x= commandeService.create(commandeEntity);
        x.setIdproduit(idproduit);
        x.setProductDTO(productDTO);


        CommandeDTO commandeDTO = new CommandeDTO().fromEntity(x);
        commandeDTO.setIdproduit(idproduit);
        commandeDTO.setProductDTO(productDTO);
        return commandeDTO;
    }




    @GetMapping("/getcmd/{id_commande}")
    public CommandeDTO getCommande(@PathVariable Long id_commande) {
        // Récupération de la commande depuis le service
        CommandeEntity c = commandeService.one_commande(id_commande);

        // Transformation de l'entité en DTO
        CommandeDTO commandeDTO = new CommandeDTO().fromEntity(c);

        // Ajout des informations iduser et idproduit
        commandeDTO.setIduser(c.getIduser());
        commandeDTO.setIdproduit(c.getIdproduit());

        // Si les IDs utilisateur et produit ne sont pas null, récupération des DTOs associés
        if (c.getIduser() != null && c.getIdproduit() != null) {
            try {
                UserDTO userDTO = commande_user.getUser(c.getIduser());
                ProductDTO productDTO = client_product.getProduct(c.getIdproduit());

                commandeDTO.setUserDTO(userDTO);
                commandeDTO.setProductDTO(productDTO);
            } catch (FeignException.NotFound e) {
                // En cas d'exception, on affiche un message d'erreur
                System.err.println("Produit ou utilisateur non trouvé pour la commande ID: " + c.getId_commande());
            }
        }

        // Retour du DTO final
        return commandeDTO;
    }


   @PutMapping("/updatecmd/{id_commande}")
   public CommandeDTO update(@PathVariable Long id_commande,  CommandeEntity commandeEntity) {


       commandeEntity.setId_commande(id_commande);
       //avoir instance old commande
       CommandeEntity old_commande =commandeService.one_commande(id_commande);

       if(commandeEntity.getId_commande()==null)   {commandeEntity.setId_commande(old_commande.getId_commande());}
       if(commandeEntity.getStatut_commande()==null) {commandeEntity.setStatut_commande(old_commande.getStatut_commande());}
       if(commandeEntity.getArticel_commande()==null) {commandeEntity.setArticel_commande(old_commande.getArticel_commande());}
       if(commandeEntity.getDateCommande()==null) {commandeEntity.setDateCommande(old_commande.getDateCommande());}
       if(commandeEntity.getCommentaires()==null){commandeEntity.setCommentaires(old_commande.getCommentaires());}
       if (commandeEntity.getAdresse_livraison()==null) {commandeEntity.setAdresse_livraison(old_commande.getAdresse_livraison());}
       if(commandeEntity.getDate_livraison_estimee()==null){commandeEntity.setDate_livraison_estimee(old_commande.getDate_livraison_estimee());}
       if(commandeEntity.getFraisLivraison()==0){commandeEntity.setFraisLivraison(old_commande.getFraisLivraison());}
       if(commandeEntity.getRemise()==0){commandeEntity.setRemise(old_commande.getRemise());}
       if(commandeEntity.getTotal()==0){commandeEntity.setTotal(old_commande.getTotal());}
       if(commandeEntity.getDate_livraison_estimee()==null){commandeEntity.setDate_livraison_estimee(old_commande.getDate_livraison_estimee());}
       if(commandeEntity.getisIspaied()==false){commandeEntity.setIspaied(old_commande.getisIspaied());}

       if(commandeEntity.getLatitude()==0){commandeEntity.setLatitude(old_commande.getLatitude());}
       if(commandeEntity.getLongitude()==0){commandeEntity.setLongitude(old_commande.getLongitude());}


       CommandeEntity cmd=commandeService.update(commandeEntity);
       CommandeDTO cmdDTO=new CommandeDTO().fromEntity(cmd);
       return cmdDTO;
   }

    @DeleteMapping("/delete/{id_commande}")
    public void delete(@PathVariable Long id_commande) {
        commandeService.Delete(id_commande);
    }

  @GetMapping("/allByproductID/{idProject}")
  public List<CommandeDTO> getAllByProductID(@PathVariable Long idProject) {
      List<CommandeEntity> commandes = commandeService.alltasksbyIdproduct(idProject);
      List<CommandeDTO> commandeDTOs = new ArrayList<>();

      for (CommandeEntity commande : commandes) {
          CommandeDTO commandeDTO = new CommandeDTO().fromEntity(commande);

          commandeDTO.setId_commande(commande.getId_commande());
          commandeDTO.setIdproduit(commande.getIdproduit());
          commandeDTO.setIduser(commande.getIduser());

          // Récupérer et affecter le ProductDTO
          ProductDTO productDTO = client_product.getProduct(idProject);
          commandeDTO.setProductDTO(productDTO);

          // Supprimer complètement l'objet userDTO
          commandeDTO.setUserDTO(null);
          commandeDTOs.add(commandeDTO);
      }

      return commandeDTOs;
  }





@GetMapping("/allByUserID/{iduser}")
public List<CommandeDTO> getAllByUserID(@PathVariable Long iduser) {
    List<CommandeEntity> commandes = commandeService.alltasksbyIduser(iduser);
    List<CommandeDTO> commandeDTOs = new ArrayList<>();

    for (CommandeEntity commande : commandes) {
        CommandeDTO commandeDTO = new CommandeDTO().fromEntity(commande);

        // Affecter les identifiants nécessaires
        commandeDTO.setId_commande(commande.getId_commande());
        commandeDTO.setIduser(commande.getIduser());
        commandeDTO.setIdproduit(commande.getIdproduit());

        // Récupérer uniquement l'utilisateur (pas le produit)
        UserDTO userDTO = commande_user.getUser(commande.getIduser());
        commandeDTO.setUserDTO(userDTO);

        commandeDTOs.add(commandeDTO);
    }

    return commandeDTOs;
}




    @PostMapping("/createuser/{iduser}")
    public CommandeDTO addCommandeUser(
            @ModelAttribute CommandeEntity commandeEntity, // ← ici @ModelAttribute au lieu de @RequestBody
            @PathVariable Long iduser) {

        UserDTO userDTO = commande_user.getUser(iduser);
      //  ProductDTO productDTO = client_product.getProduct(idproduit);

        // Créer la commande avec le service
        CommandeEntity x = commandeService.create(commandeEntity);

        x.setIduser(iduser);
        x.setUserDTO(userDTO);
       // x.setIdproduit(idproduit);
     //   x.setProductDTO(productDTO);

        CommandeDTO commandeDTO = new CommandeDTO().fromEntity(x);
    //    commandeDTO.setIdproduit(idproduit);
        commandeDTO.setUserDTO(userDTO);
       // commandeDTO.setProductDTO(productDTO);

        return commandeDTO;
    }
    @PostMapping("/createUP/{iduser}/{idproduit}")
    public CommandeDTO addCommandeUser(
            @ModelAttribute CommandeEntity commandeEntity,
            @PathVariable Long iduser,
            @PathVariable Long idproduit) {

        UserDTO userDTO = commande_user.getUser(iduser);
        ProductDTO productDTO = client_product.getProduct(idproduit);

        // Préparer l’objet complet
        commandeEntity.setIduser(iduser);
        commandeEntity.setUserDTO(userDTO);
        commandeEntity.setIdproduit(idproduit);
        commandeEntity.setProductDTO(productDTO);

        // Ensuite, enregistrer dans la base
        CommandeEntity x = commandeService.create(commandeEntity);

        // Préparer le DTO à retourner
        CommandeDTO commandeDTO = new CommandeDTO().fromEntity(x);
        commandeDTO.setIdproduit(idproduit);
        commandeDTO.setUserDTO(userDTO);
        commandeDTO.setProductDTO(productDTO);

        return commandeDTO;
    }


 @GetMapping("/getAll")
 public List<CommandeDTO> getAll() {
     List<CommandeEntity> commandes = commandeService.GetAll();
     List<CommandeDTO> commandeDTOs = new ArrayList<>();

     commandes.forEach(commande -> {
         CommandeDTO dto = new CommandeDTO().fromEntity(commande);

         // ✅ Ajout explicite des ID user et produit
         dto.setIduser(commande.getIduser());
         dto.setIdproduit(commande.getIdproduit());

         if (commande.getIduser() != null && commande.getIdproduit() != null) {
             try {
                 UserDTO userDTO = commande_user.getUser(commande.getIduser());
                 ProductDTO productDTO = client_product.getProduct(commande.getIdproduit());

                 dto.setUserDTO(userDTO);
                 dto.setProductDTO(productDTO);

             } catch (FeignException.NotFound e) {
                 System.err.println("Produit ou utilisateur non trouvé pour la commande ID: " + commande.getId_commande());
             }
         }

         commandeDTOs.add(dto);
     });

     return commandeDTOs;
 }
/*@GetMapping("/getcmd/{id_commande}")
public CommandeDTO getCommande(@PathVariable Long id_commande) {
    // Récupération de la commande depuis le service
    CommandeEntity c = commandeService.one_commande(id_commande);
    System.out.println("Commande récupérée: " + c);

    // Vérification si la commande existe
    if (c == null) {
        throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Commande non trouvée");
    }

    // Transformation de l'entité en DTO
    CommandeDTO commandeDTO = new CommandeDTO().fromEntity(c);

    // Ajout des informations iduser et idproduit
    commandeDTO.setIduser(c.getIduser());
    commandeDTO.setIdproduit(c.getIdproduit());

    // Log pour vérifier les valeurs des IDs
    System.out.println("iduser: " + c.getIduser() + ", idproduit: " + c.getIdproduit());

    // Si les IDs utilisateur et produit ne sont pas null, récupération des DTOs associés
    if (c.getIduser() != null && c.getIdproduit() != null) {
        try {
            // Récupération du UserDTO
            UserDTO userDTO = commande_user.getUser(c.getIduser());
            // Récupération du ProductDTO
            ProductDTO productDTO = client_product.getProduct(c.getIdproduit());

            // Attribution des DTOs dans le CommandeDTO
            commandeDTO.setUserDTO(userDTO);
            commandeDTO.setProductDTO(productDTO);

            // Log pour vérifier les données du UserDTO et ProductDTO
            System.out.println("userDTO: " + userDTO);
            System.out.println("productDTO: " + productDTO);
        } catch (FeignException.NotFound e) {
            // En cas d'exception, on affiche un message d'erreur
            System.err.println("Produit ou utilisateur non trouvé pour la commande ID: " + c.getId_commande());
        }
    } else {
        // Si l'un des IDs est null, on affiche un message de log
        System.err.println("iduser ou idproduit est null pour la commande ID: " + c.getId_commande());
    }

    // Retour du DTO final
    return commandeDTO;
}*/


}

