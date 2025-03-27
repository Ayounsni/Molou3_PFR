import { AppRole } from "./app-role.model";


export interface AppUser {
  id: number;
  email: string;
  password: string; 
  photoUrl?: string;
  ville: string;
  adresse?: string;
  telephone: string;
  description?: string;
  enabled: boolean;
  role?: AppRole;
}