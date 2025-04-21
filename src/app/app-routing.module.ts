import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsersComponent } from './component/users/users.component';
import { DestinationComponent } from './component/destination/destination.component';
import { ProductsComponent } from './component/products/products.component';
import { ChatComponent } from './component/chat/chat.component';
import { LivreurComponent } from './component/livreur/livreur.component';
import { ClientComponent } from './component/client/client.component';
import { OrderUserClientComponent } from './component/order-user-client/order-user-client.component';
import { RealTimeNotificationsComponent } from './component/real-time-notifications/real-time-notifications.component';
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
import { PageClientComponent } from './component/pageclient/page-client.component';
import { UpdateadminComponent } from './component/updateadmin/updateadmin.component';
import { ForgotPasswordComponent } from './component/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './component/reset-password/reset-password.component';
import { ProfileComponent } from './component/profile/profile.component';



const routes: Routes = [
  { path: "home", component: HomeComponent },
  { path: "users", component: UsersComponent },
  { path: "destination", component: DestinationComponent },
  { path: "products", component: ProductsComponent },
  { path: 'client', component: ClientComponent },
  { path: "",component: LoginComponent}, 
  {path: "chat/:id", component: ChatComponent},
  {path: "livreur", component: LivreurComponent},
  {path: "client", component: ClientComponent},
  {path: "order-user-client", component: OrderUserClientComponent},
  {path: "real-time-notifications", component: RealTimeNotificationsComponent},
  {path:"notification",component:NotificationComponent},
  {path:"message", component:MessageComponent},
  {path:"admin", component:AdminComponent},
  {path:"clients", component:ClientsComponent},
  {path:"destination", component:DestinationComponent},
  {path:"products", component:ProductsComponent},
  {path:"orders", component:OrdersComponent},
  {path:"detailsuser/:id",component:DetailsuserComponent},
  {path:"detailsorder/:id",component:DetaisorderComponent},
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
  {path:"forgot-password",component:ForgotPasswordComponent},
  {path: "reset-password/:token", component: ResetPasswordComponent}, 
  {path:"updateprofile",component:ProfileComponent},
];
@NgModule({
  imports: [RouterModule.forRoot(routes)], // or RouterModule.forChild(routes) for feature modules
  exports: [RouterModule]

})
export class AppRoutingModule { }
