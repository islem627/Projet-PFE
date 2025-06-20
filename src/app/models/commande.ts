export interface Commande {
  id_commande: string;
  dateCommande: string;
  statut_commande: string;
  adresse_livraison: string;
  total: number;
  remise: number;
  fraisLivraison: number;
  date_livraison_estimee?: string;
  commentaires?: string;
  ispaied?: boolean;
  latitude?: string;
  longitude?: number;
  idproduit?: number;
  iduser?: number;
  userDTO?: UserDTO;
  livreurId?: number;
  gouvernoratCmd?: string;
  articel_commande?: string;
  longueur_cm?: number;
  largeur_cm?: number;
  hauteur_cm?: number;
  poids_grammes?: number;
  enseigne?: string;
  destination_enseigne?: string;
  archived?: boolean;
  noteClient?: number;
  commentaireClient?: string;
  date_livree?: string;
  date_ajoutsystem?: string;
  date_affection?: string;
  date_expidetion?: string;
  idpartenaire?: string;
  deliveryOption?: string;
  fixe_temps?: string;
}
export interface UserDTO {
  id: number;
  firstname: string;
  lastname: string;
  username: string;
  phone: string;
  email: string;
  address: string;
  role: string;
  gouvernorat: string;
  photo: string;
  confirme?: boolean;
  passwordResetToken?: string | null;
  password?: string;
}

export interface ProductDTO {
  id: number;
  name: string;
  description: string;
  price: number;
  dateAdded: string;
  photo: string | null;
  type: string;
  Disponible: boolean;
  quantity: number;
}
