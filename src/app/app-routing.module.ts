import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsersComponent } from './component/users/users.component';
import { DestinationComponent } from './component/destination/destination.component';
import { ProductsComponent } from './component/products/products.component';
import { ChatComponent } from './component/chat/chat.component';
import { LivreurComponent } from './component/livreur/livreur.component';
import { ClientComponent } from './component/client/client.component';
import { OrderUserClientComponent } from './component/order-user-client/order-user-client.component';
import { NotificationComponent } from './component/notification/notification.component';
import { MessageComponent } from './component/message/message.component';
import { AdminComponent } from './component/admin/admin.component';
import { ClientsComponent } from './component/clients/clients.component';
import { HomeComponent } from './component/home/home.component';
import { LoginComponent } from './component/login/login.component';
import { OrdersComponent } from './component/orders/orders.component';
import { DetailsuserComponent } from './component/detailsuser/detailsuser.component';
import { DetailsadminComponent } from './component/detailsadmin/detailsadmin.component';
import { DetaisorderComponent } from './component/detailsorder/detaisorder.component';
import { UpdateorderComponent } from './component/updateorder/updateorder.component';
import { DetailsclientComponent } from './component/detailsclient/detailsclient.component';
import { DetailsproductComponent } from './component/detailsproduct/detailsproduct.component';
import { AddusersComponent } from './component/addusers/addusers.component';
import { AddproductComponent } from './component/addproduct/addproduct.component';
import { AddorderComponent } from './component/addorder/addorder.component';
import { UpdateproductComponent } from './component/updateproduct/updateproduct.component';
import { UpdateuserComponent } from './component/updateuser/updateuser.component';
import { UpdateadminComponent } from './component/updateadmin/updateadmin.component';
import { ProfileComponent } from './component/profile/profile.component';
import { LivreursComponent } from './component/livreurs/livreurs.component';
import { DetailslivreurComponent } from './component/detailslivreur/detailslivreur.component';
import { UpdatelivreurComponent } from './component/updatelivreur/updatelivreur.component';
import { AssignByGovernorateComponent } from './component/assign-by-governorate/assign-by-governorate.component';
import { ForgotPasswordComponent } from './component/forgot-password/forgot-password.component';
import { Path } from 'leaflet';
import { NotifclientComponent } from './component/notifclient/notifclient.component';
import { PageDeleviryComponent } from './component/page-deleviry/page-deleviry.component';
import { DeliveryComponent } from './component/delivery/delivery.component';
import { ClientNotificationsComponent } from './component/client-notifications/client-notifications.component';
import { PartnerComponent } from './component/partner/partner.component';
import { PlanningComponent } from './component/planning/planning.component';
import { HistoriqueComponent } from './component/historique/historique.component';
import { PageClientComponent } from './component/pageclient/pageclient/page-client.component';
import { DeliveryTrackerComponent } from './component/delivery-tracker/delivery-tracker.component';
import { MapsComponent } from './component/maps/maps.component';
import { HistoPartnerComponent } from './component/histo-partner/histo-partner.component';
import { DateComponent } from './component/date/date.component';
import { DetailsOrdesComponent } from './details-ordes/details-ordes.component';
import { DetailsComponent } from './component/details/details.component';
import { CommandeDetailsComponent } from './commande-details/commande-details.component';
import { AllPartnerComponent } from './component/all-partner/all-partner.component';
import { DetailsPartnerComponent } from './component/details-partner/details-partner.component';
import { UpdatePartnerComponent } from './component/update-partner/update-partner.component';




const routes: Routes = [
  { path: "home", component: HomeComponent },
  { path: "users", component: UsersComponent },
  { path: "destination", component: DestinationComponent },
  { path: "products", component: ProductsComponent },
  { path: 'client', component: ClientComponent },
  { path: "",component: LoginComponent}, 
  { path: 'chat/:userId', component: ChatComponent },
  {path: "livreur", component: LivreurComponent},
  {path: "client", component: ClientComponent},
  {path: "order-user-client", component: OrderUserClientComponent},
  {path:"notification",component:NotificationComponent},
  {path:"message", component:MessageComponent},
  {path:"admin", component:AdminComponent},
  {path:"clients", component:ClientsComponent},
  {path:"destination", component:DestinationComponent},
  {path:"products", component:ProductsComponent},
  {path:"orders", component:OrdersComponent},
  {path:"detailsuser/:id",component:DetailsuserComponent},
  {path:"updateorder",component:UpdateorderComponent},
  {path:"detailsadmin/:id",component:DetailsadminComponent},
  {path:"detailsclient/:id",component:DetailsclientComponent},
  {path:"detailsproduct/:id",component:DetailsproductComponent},
  {path:"adduser",component:AddusersComponent},
  {path:"addproduct",component:AddproductComponent},
  {path:"addorder",component:AddorderComponent},
  {path:"updateproduct/:id",component:UpdateproductComponent},
  {path: "updateorder/:id", component: UpdateorderComponent},
  {path:"updateuser/:id",component:UpdateuserComponent},
  {path:"pageclient", component:PageClientComponent},
  {path:"updateadmin/:id",component:UpdateadminComponent},
    {path:"updatelivreur/:id",component:UpdatelivreurComponent},
        {path:"updatepartner/:id",component:UpdatePartnerComponent},


  {path:"updateprofile",component:ProfileComponent},
  {path:"livreurs",component:LivreursComponent},
  {path:"detailslivreur/:id",component:DetailslivreurComponent},
  {path:"forgot-password",component:ForgotPasswordComponent},
  {path:"notifclient",component:NotifclientComponent},
  {path:"delivery", component:PageDeleviryComponent},
  { path: 'delivery', component: DeliveryComponent },
  { path: 'notifications', component: ClientNotificationsComponent },
  //{ path: '', redirectTo: '/notifications', pathMatch: 'full' },:
  {path:'partner',component:PartnerComponent},

  {path:'planning',component:PlanningComponent},
  {path:'historique',component:HistoriqueComponent},
  {path:'tracking',component:DeliveryTrackerComponent},
  {path:'maps',component:MapsComponent},
  {path:"his_par", component: HistoPartnerComponent},
  {path:"fixe/:iduser",component:DateComponent},
  {path:"detail/:id",component:DetailsComponent},
    {path:"detailsorder/:id",component:CommandeDetailsComponent},
{ path: 'commande/:id', component: CommandeDetailsComponent },
{path:'all_partner',component:AllPartnerComponent},
{path:'DetailsPartner/:id',component:DetailsPartnerComponent},





];
@NgModule({
 // imports: [RouterModule.forRoot(routes)], // or RouterModule.forChild(routes) for feature modules
 imports : [RouterModule.forRoot(routes, { useHash: false })], // ou tout simplement sans options

 exports: [RouterModule]

})
export class AppRoutingModule { }
