import { Component, OnInit } from '@angular/core';
import { getMessaging, getToken } from 'firebase/messaging';
import { environement } from 'src/environements/environement';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  ngOnInit(): void {
    this.requestPermission();}
  title = 'notification-web';

  requestPermission() {
   
        const messaging = getMessaging();
        getToken(messaging, { vapidKey:environement.firebase.vpaidkey})
          .then((currentToken) => {
            if (currentToken) {
              console.log("yeah we have token ");
             console.log(currentToken);
            }
        
          
       else {
        console.log("we have problem");
      }
    });
  }
}