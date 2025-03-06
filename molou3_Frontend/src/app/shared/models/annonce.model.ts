import { AppUser } from "./app-user.model";
import { User } from "./user.model";

export interface Annonce {
  id?: number;
  titre: string;
  contenu: string;
  datePublication: string | Date;
  association?: User;
}