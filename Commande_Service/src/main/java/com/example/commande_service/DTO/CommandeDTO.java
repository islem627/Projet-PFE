package com.example.commande_service.DTO;

import com.example.commande_service.entities.CommandeEntity;

import java.time.LocalDate;



public class CommandeDTO {
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
    private boolean ispaied=false;
    private double latitude;
    private double longitude;
    private Long idproduit;
    private Long iduser;
    private ProductDTO productDTO;
    private UserDTO userDTO;

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

    // Constructeur dédié pour convertir une CommandeEntity en CommandeDTO
    public CommandeDTO(CommandeEntity commandeEntity) {
        this.id_commande = commandeEntity.getId_commande();
        this.dateCommande = commandeEntity.getDateCommande();
        this.statut_commande = commandeEntity.getStatut_commande(); // Si Enum
        this.adresse_livraison = commandeEntity.getAdresse_livraison();
        this.total = commandeEntity.getTotal();
        this.articel_commande = commandeEntity.getArticel_commande();
        this.remise = commandeEntity.getRemise();
        this.fraisLivraison = commandeEntity.getFraisLivraison();
        this.date_livraison_estimee = commandeEntity.getDate_livraison_estimee();
        this.commentaires = commandeEntity.getCommentaires();
        this.ispaied = commandeEntity.getisIspaied();
        this.latitude = commandeEntity.getLatitude();
        this.longitude = commandeEntity.getLongitude();
    if (commandeEntity == null) throw new IllegalArgumentException("CommandeEntity ne peut pas être null");
        this.id_commande =commandeEntity.getId_commande();
        this.statut_commande = commandeEntity.getStatut_commande();
    }

    public CommandeDTO(Long id_commande, LocalDate dateCommande, String statut_commande, String adresse_livraison, double total, String articel_commande, double remise, double fraisLivraison, LocalDate date_livraison_estimee, String commentaires, boolean ispaied, double latitude, double longitude) {
        this.id_commande = id_commande;
        this.dateCommande = dateCommande;
        this.statut_commande = statut_commande;
        this.adresse_livraison = adresse_livraison;
        this.total = total;
        this.articel_commande = articel_commande;
        this.remise = remise;
        this.fraisLivraison = fraisLivraison;
        this.date_livraison_estimee = date_livraison_estimee;
        this.commentaires = commentaires;
        this.ispaied = ispaied;
        this.latitude = latitude;
        this.longitude = longitude;
    }

    public CommandeDTO() {
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

    public boolean isIspaied() {
        return ispaied;
    }

    public void setIspaied(boolean ispaied) {
        this.ispaied = ispaied;
    }

    public double getLatitude() {
        return latitude;
    }

    public void setLatitude(double latitude) {
        this.latitude = latitude;
    }

    public double getLongitude() {
        return longitude;
    }

    public void setLongitude(double longitude) {
        this.longitude = longitude;
    }

    public CommandeDTO fromEntity (CommandeEntity commandeEntity)
    {CommandeDTO commandeDTO=new CommandeDTO();//création d'une nouvelle instance
        commandeDTO.setId_commande(commandeEntity.getId_commande());
        commandeDTO.setDateCommande(commandeEntity.getDateCommande());
        commandeDTO.setStatut_commande(commandeEntity.getStatut_commande()); // Si statut est un Enum
        commandeDTO.setAdresse_livraison(commandeEntity.getAdresse_livraison());
        commandeDTO.setTotal(commandeEntity.getTotal());
        commandeDTO.setArticel_commande(commandeEntity.getArticel_commande());
        commandeDTO.setRemise(commandeEntity.getRemise());
        commandeDTO.setFraisLivraison(commandeEntity.getFraisLivraison());
        commandeDTO.setDate_livraison_estimee(commandeEntity.getDate_livraison_estimee());
        commandeDTO.setCommentaires(commandeEntity.getCommentaires());
        commandeDTO.setIspaied(commandeEntity.getisIspaied());
        commandeDTO.setLongitude(commandeEntity.getLongitude());
        commandeDTO.setLatitude(commandeEntity.getLatitude());
        commandeDTO.setIdproduit(commandeEntity.getIdproduit());
        commandeDTO.setIduser(commandeEntity.getIduser());


        return commandeDTO;
    }

    public CommandeEntity toEntity(CommandeDTO commandeDTO) {
        CommandeEntity commandeEntity = new CommandeEntity(commandeDTO); // création d'une instance vide
        commandeDTO.setId_commande(commandeEntity.getId_commande());
        commandeEntity.setDateCommande(commandeDTO.getDateCommande());
        commandeEntity.setStatut_commande(commandeEntity.getStatut_commande()); // Si StatutCommande est un Enum
        commandeEntity.setAdresse_livraison(commandeDTO.getAdresse_livraison());
        commandeEntity.setTotal(commandeDTO.getTotal());
        commandeEntity.setArticel_commande(commandeDTO.getArticel_commande()); // Convertir la chaîne en liste d'articles
        commandeEntity.setRemise(commandeDTO.getRemise());
        commandeEntity.setFraisLivraison(commandeDTO.getFraisLivraison());
        commandeEntity.setDate_livraison_estimee(commandeDTO.getDate_livraison_estimee());
        commandeEntity.setCommentaires(commandeDTO.getCommentaires());
        commandeEntity.setLatitude(commandeDTO.getLatitude());
        commandeEntity.setLongitude(commandeDTO.getLongitude());
        commandeDTO.setIspaied(commandeDTO.isIspaied());
        commandeDTO.setIdproduit(commandeDTO.getIdproduit());
        commandeDTO.setIduser(commandeDTO.getIduser());

        return commandeEntity; // Retour de l'entité
    }


}
