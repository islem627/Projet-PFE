import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './component/home/home.component';
import { SidebarComponent } from './component/sidebar/sidebar.component';
import { HeaderComponent } from './component/header/header.component';
import { FooterComponent } from './component/footer/footer.component';
import { OrdersComponent } from './component/orders/orders.component';
import { ProductsComponent } from './component/products/products.component';
import { UsersComponent } from './component/users/users.component';
import { LoginComponent } from './component/login/login.component'; 
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import {  ToastrModule } from 'ngx-toastr';
import { ChatComponent } from './component/chat/chat.component';//ss
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { LivreurComponent } from './component/livreur/livreur.component';
import { ClientComponent } from './component/client/client.component';
import { OrderUserClientComponent } from './component/order-user-client/order-user-client.component';
import { environement } from 'src/environements/environement'; 
import * as firebase from 'firebase/app';
import { PushNotificationComponent } from './component/push-notification/push-notification.component';
import { NotificationComponent } from './component/notification/notification.component';
import { MessageComponent } from './component/message/message.component';
import { AdminComponent } from './component/admin/admin.component';
import { ClientsComponent } from './component/clients/clients.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxPaginationModule } from 'ngx-pagination';
import { DetailsuserComponent } from './component/detailsuser/detailsuser.component';
import { DetaisorderComponent } from './component/detailsorder/detaisorder.component';
import { UpdateorderComponent } from './component/updateorder/updateorder.component';
import { DetailsadminComponent } from './component/detailsadmin/detailsadmin.component';
import { DetailsclientComponent } from './component/detailsclient/detailsclient.component';
import { DetailsproductComponent } from './component/detailsproduct/detailsproduct.component';
import { AddusersComponent } from './component/addusers/addusers.component';
import { AddproductComponent } from './component/addproduct/addproduct.component';
import { AddorderComponent } from './component/addorder/addorder.component';
import { UpdateproductComponent } from './component/updateproduct/updateproduct.component';
import { UpdateuserComponent } from './component/updateuser/updateuser.component';
import { HeaderclientComponent } from './component/headerclient/headerclient.component';
import { HeaderlivreurComponent } from './component/headerlivreur/headerlivreur.component';
import { UpdateadminComponent } from './component/updateadmin/updateadmin.component';
import { ProfileComponent } from './component/profile/profile.component';
import { CommonModule, HashLocationStrategy, LocationStrategy } from '@angular/common';
import { LivreursComponent } from './component/livreurs/livreurs.component';
import { DetailslivreurComponent } from './component/detailslivreur/detailslivreur.component';
import { UpdatelivreurComponent } from './component/updatelivreur/updatelivreur.component';
import { AssignByGovernorateComponent } from './component/assign-by-governorate/assign-by-governorate.component';
import { FindByIdPipe } from './pipes/find-by-id.pipe';
import { DestinationComponent } from './component/destination/destination.component';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ForgotPasswordComponent } from './component/forgot-password/forgot-password.component';
import { PageDeleviryComponent } from './component/page-deleviry/page-deleviry.component';
import { NotifclientComponent } from './component/notifclient/notifclient.component';
import { DeliveryComponent } from './component/delivery/delivery.component';
import { ClientNotificationsComponent } from './component/client-notifications/client-notifications.component';
import { PartnerComponent } from './component/partner/partner.component';
import { PlanningComponent } from './component/planning/planning.component';
import { HistoriqueComponent } from './component/historique/historique.component';
import { PageClientComponent } from './component/pageclient/pageclient/page-client.component';


import { AuthService } from './services/auth.service';
import { AllmyservicesService } from './services/allmyservices.service';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { DeliveryTrackerComponent } from './component/delivery-tracker/delivery-tracker.component';
import { GoogleMapsModule } from '@angular/google-maps';
import { StompTestComponent } from './component/stomp-test/stomp-test.component';
import { MapsComponent } from './component/maps/maps.component';
import { HistoPartnerComponent } from './component/histo-partner/histo-partner.component';
import { DateComponent } from './component/date/date.component';
import { SidebarClientComponent } from './component/sidebar-client/sidebar-client.component';
import { SidebarPartnerComponent } from './component/sidebar-partner/sidebar-partner.component';
import { SidebarLivreurComponent } from './component/sidebar-livreur/sidebar-livreur.component';
import { DetailsOrdesComponent } from './details-ordes/details-ordes.component';
import { DetailsComponent } from './component/details/details.component';
import { CommandeDetailsComponent } from './commande-details/commande-details.component';
import { AllPartnerComponent } from './component/all-partner/all-partner.component';
import { DetailsPartnerComponent } from './component/details-partner/details-partner.component';
import { UpdatePartnerComponent } from './component/update-partner/update-partner.component';


firebase.initializeApp(environement.firebase);


const socketConfig: SocketIoConfig = {
  url: 'http://localhost:8080',
  options: { transports: ['websocket', 'polling'] }
};



@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SidebarComponent,
    HeaderComponent,
    FooterComponent,
    OrdersComponent,
    ProductsComponent,
    UsersComponent,
    DestinationComponent,
    LoginComponent,
    ChatComponent,
    LivreurComponent,
    ClientComponent,
    OrderUserClientComponent,
    PushNotificationComponent,
    NotificationComponent,
    MessageComponent,
    AdminComponent,
    ClientsComponent,
    DetailsuserComponent,
    DetaisorderComponent,
    UpdateorderComponent,
    DetailsadminComponent,
    DetailsclientComponent,
    DetailsproductComponent,
    AddusersComponent,
    AddproductComponent,
    AddorderComponent,
    UpdateproductComponent,
    UpdateuserComponent,
    PageClientComponent,
    HeaderclientComponent,
    HeaderlivreurComponent,
    UpdateadminComponent,
    ProfileComponent,
    LivreursComponent,
    DetailslivreurComponent,
    UpdatelivreurComponent,
    AssignByGovernorateComponent,
    FindByIdPipe,
    ForgotPasswordComponent,
    PageDeleviryComponent,
    NotifclientComponent,
    DeliveryComponent,
    ClientNotificationsComponent,
    PartnerComponent,
    PlanningComponent,
    HistoriqueComponent,
  

    DeliveryTrackerComponent,
     StompTestComponent,
     MapsComponent,
     HistoPartnerComponent,
     DateComponent,
     SidebarClientComponent,
     SidebarPartnerComponent,
     SidebarLivreurComponent,
     DetailsOrdesComponent,
     DetailsComponent,
     CommandeDetailsComponent,
     AllPartnerComponent,
     DetailsPartnerComponent,
     UpdatePartnerComponent,
    
    
  ],

  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule, // Ajouter FormsModule ici
    ToastrModule.forRoot(),  // ToastrModule ajouté
 
    HttpClientModule,
    BrowserAnimationsModule,
    NgxPaginationModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatFormFieldModule,
    CommonModule,
    GoogleMapsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
        NgxPaginationModule,
        MatSelectModule,
        MatFormFieldModule,
        CommonModule,
        ToastrModule.forRoot(),
        GoogleMapsModule
    
  

    
  ],
 // providers: [{ provide: LocationStrategy, useClass: HashLocationStrategy }],
 providers: [

   AuthService, 
  AllmyservicesService,
 ],
   bootstrap: [AppComponent]
})
export class AppModule { }
