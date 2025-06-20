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
  iduser: number;
  articelCommande?: string;
  adresseLivraison?: string;
  dateCommande?: string;
}