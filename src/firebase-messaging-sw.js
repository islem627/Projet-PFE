/*importScripts("https://www.gstatic.com/firebasejs/11.4.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/11.4.0/firebase-messaging-compat.js");
firebase.initializeApp = ({
  
        apiKey: "AIzaSyBf690e8Q6mbfu1jwNIg_KeWpODs0Gy9kQ",
        authDomain: "webnotification-45401.firebaseapp.com",
        projectId: "webnotification-45401",
        storageBucket: "webnotification-45401.firebasestorage.app",
        messagingSenderId: "455879327393",
        appId: "1:455879327393:web:e1a5f43270d8f612c9bae0"
      

});
const messaging = firebase.messaging();
messaging.onBackgroundMessage((payload) => {
  console.log('Message reçu en arrière-plan:', payload);
  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: payload.notification.icon
  });
});*/
importScripts("https://www.gstatic.com/firebasejs/10.2.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.2.0/firebase-messaging-compat.js");

// Initialisation correcte de Firebase
firebase.initializeApp({
  apiKey: "AIzaSyDUwNO_aGqQ-zJO0ueWe3M6bUhJwn7vOmo",
  authDomain: "notification-634cb.firebaseapp.com",
  projectId: "notification-634cb",
  storageBucket: "notification-634cb.firebasestorage.app",
  messagingSenderId: "584692646252",
  appId: "1:584692646252:web:ed92dc73a8c20ca15c3349"
});

// Récupération de l'instance de Firebase Messaging
const messaging = firebase.messaging();

// Gestion des messages reçus en arrière-plan
messaging.onBackgroundMessage((payload) => {
  console.log("Message reçu en arrière-plan:", payload);

  // Vérifier que la notification est bien définie
  if (payload.notification) {
    self.registration.showNotification(payload.notification.title, {
      body: payload.notification.body,
      icon: payload.notification.icon
    });
  }
});
