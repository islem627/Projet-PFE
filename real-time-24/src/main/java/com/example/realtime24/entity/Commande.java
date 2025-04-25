package com.example.realtime24.entity;



import com.example.realtime24.DTO.CommandeDTO;
import com.example.realtime24.DTO.ProductDTO;
import com.example.realtime24.DTO.UserDTO;
import jakarta.persistence.*;
import org.apache.catalina.User;

import java.time.LocalDate;


@SuppressWarnings("ALL")
@Entity
public class Commande {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_commande;
    private LocalDate dateCommande;
    private String statut_commande;
    private String adresse_livraison;
    private double total;
    private String articel_commande;
    private double remise;
    private double fraisLivraison;
    private LocalDate date_livraison_estimee;
    private String commentaires;
    private boolean ispaied = false;
    private double latitude;
    private double longitude;
    @Column(name = "iduser") // ← important !
    private Long iduser;
    private Long idproduit;


    @Transient
    private ProductDTO productDTO;
    @Transient
    private UserDTO userDTO;

    public boolean isIspaied() {
        return ispaied;
    }

    public Long getIduser() {
        return iduser;
    }

    public void setIduser(Long iduser) {
        this.iduser = iduser;
    }

    public UserDTO getUserDTO() {
        return userDTO;
    }

    public void setUserDTO(UserDTO userDTO) {
        this.userDTO = userDTO;
    }

    public Long getIdproduit() {
        return idproduit;
    }

    public void setIdproduit(Long idproduit) {
        this.idproduit = idproduit;
    }

    public ProductDTO getProductDTO() {
        return productDTO;
    }

    public void setProductDTO(ProductDTO productDTO) {
        this.productDTO = productDTO;
    }

    public Long getId_commande() {
        return id_commande;
    }

    public void setId_commande(Long id_commande) {
        this.id_commande = id_commande;
    }

    public LocalDate getDateCommande() {
        return dateCommande;
    }

    public void setDateCommande(LocalDate dateCommande) {
        this.dateCommande = dateCommande;
    }

    public String getStatut_commande() {
        return statut_commande;
    }

    public void setStatut_commande(String statut_commande) {
        this.statut_commande = statut_commande;
    }

    public String getAdresse_livraison() {
        return adresse_livraison;
    }

    public void setAdresse_livraison(String adresse_livraison) {
        this.adresse_livraison = adresse_livraison;
    }

    public double getTotal() {
        return total;
    }

    public void setTotal(double total) {
        this.total = total;
    }

    public String getArticel_commande() {
        return articel_commande;
    }

    public void setArticel_commande(String articel_commande) {
        this.articel_commande = articel_commande;
    }

    public double getRemise() {
        return remise;
    }

    public void setRemise(double remise) {
        this.remise = remise;
    }

    public double getFraisLivraison() {
        return fraisLivraison;
    }

    public void setFraisLivraison(double fraisLivraison) {
        this.fraisLivraison = fraisLivraison;
    }

    public LocalDate getDate_livraison_estimee() {
        return date_livraison_estimee;
    }

    public void setDate_livraison_estimee(LocalDate date_livraison_estimee) {
        this.date_livraison_estimee = date_livraison_estimee;
    }

    public String getCommentaires() {
        return commentaires;
    }

    public void setCommentaires(String commentaires) {
        this.commentaires = commentaires;
    }


    public boolean getisIspaied() {
        return ispaied;
    }

    public void setIspaied(boolean ispaied) {
        this.ispaied = ispaied;
    }
}