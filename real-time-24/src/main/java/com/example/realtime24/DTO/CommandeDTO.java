package com.example.realtime24.DTO;

public class CommandeDTO {
    private String id_commande;
    private String dateCommande;
    private String statut_commande;
    private String adresse_livraison;
    private double total;
    private double remise;
    private Integer iduser;

    // Getters and setters
    public String getId_commande() { return id_commande; }
    public void setId_commande(String id_commande) { this.id_commande = id_commande; }
    public String getDateCommande() { return dateCommande; }
    public void setDateCommande(String dateCommande) { this.dateCommande = dateCommande; }
    public String getStatut_commande() { return statut_commande; }
    public void setStatut_commande(String statut_commande) { this.statut_commande = statut_commande; }
    public String getAdresse_livraison() { return adresse_livraison; }
    public void setAdresse_livraison(String adresse_livraison) { this.adresse_livraison = adresse_livraison; }
    public double getTotal() { return total; }
    public void setTotal(double total) { this.total = total; }
    public double getRemise() { return remise; }
    public void setRemise(double remise) { this.remise = remise; }
    public Integer getIduser() { return iduser; }
    public void setIduser(Integer iduser) { this.iduser = iduser; }
}