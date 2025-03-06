
import { StatusInscription } from './enums/enums';
import { NiveauExperience } from './enums/enums';

export interface LoginResponse {
  id: number;
  email: string;
  role: string;
  token: string;
  ville: string;
  telephone: string;
  photoUrl?: string;
  adresse?: string;
  description?: string;
  enabled: boolean;
  nomComplet?: string | null;
  niveauExperience?: NiveauExperience | null;
  dateNaissance?: string | Date | null;
  nomAssociation?: string | null;
  responsable?: string | null;
  dateCreation?: string | Date | null;
  statusInscription?: StatusInscription | null;
  preuveLegalePath?: string | null;
}