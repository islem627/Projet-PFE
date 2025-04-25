/*export interface AuthResponse {
    token: string;
    type: string;
    refreshToken: string;
    id: number;
    username: string;
    email: string;
    role: string;
  }
  */
 // src/app/models/auth-response.ts
export interface AuthResponse {
  token: string;
  refreshToken: string;
  role: string;
  username: string;
  email: string;
  id: number; // Ajouter ce champ
}