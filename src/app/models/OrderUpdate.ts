/*export interface OrderUpdate {
    orderId: string;
    status: string;
    commandeDTO?: any;
  }*/
 // src/app/models/order-update.ts
// src/app/models/order-update.ts
export interface OrderUpdate {
  orderId: string;
  status: string;
  articelCommande: string | null;
  adresseLivraison: string | null;
  dateCommande: string | null;
}