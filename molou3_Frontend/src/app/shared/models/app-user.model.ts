import { AppRole } from "./app-role.model";


export interface AppUser {
  id: number;
  email: string;
  password: string; // Peut être omis dans les réponses API après login
  photoUrl?: string;
  ville: string;
  adresse?: string;
  telephone: string;
  description?: string;
  enabled: boolean;
  role?: AppRole;
}