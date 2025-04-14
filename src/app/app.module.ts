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
import { DestinationComponent } from './component/destination/destination.component';
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
import { RealTimeNotificationsComponent } from './component/real-time-notifications/real-time-notifications.component';
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
firebase.initializeApp(environement.firebase);

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
    RealTimeNotificationsComponent,
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
    UpdateuserComponent    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule, // Ajouter FormsModule ici
    ToastrModule.forRoot(
      {
      /* progressBar: true,
        closeButton: true,
        newestOnTop: true,
        tapToDismiss: true,
        positionClass: 'toast-top-right',
        timeOut: 8000*/
      }
    ),
    ReactiveFormsModule ,
    HttpClientModule ,
    BrowserAnimationsModule,
    NgxPaginationModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
