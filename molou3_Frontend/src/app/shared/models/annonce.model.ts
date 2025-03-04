import { Association } from './association.model';

export interface Annonce {
  id?: number;
  titre: string;
  contenu: string;
  datePublication: string | Date;
  association?: Association;
}