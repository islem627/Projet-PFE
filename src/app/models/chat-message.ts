/*
export interface ChatMessage {
    message: string;
    user: string;
    timestamp: string;      // Date et heure d'envoi (sous forme ISO)
    isRead: boolean;        // Est-ce que le message a été lu ?
    readTimestamp?: string; // Optionnel : la date/heure de lecture
    sender: string; // ← ajoute cette ligne !
    message_side: string; // ← ajoute ceci aussi
    status: string;


}
    */

// src/app/models/chat-message.ts
// src/app/models/chat-message.ts
// src/app/models/chat-message.ts
// src/app/models/chat-message.ts
// src/app/models/chat-message.ts
// src/app/models/chat-message.ts
export interface ChatMessage {
    id?: string;
    message: string;
    user: string;
    timestamp?: string;
    seen?: boolean;
    seenTimestamp?: string;
    message_side?: 'sender' | 'receiver'; // Ajout de la propriété
  }