import { AppRole } from './app-role.model';
import { StatusInscription } from './enums/enums';
import { NiveauExperience } from './enums/enums';
import { Annonce } from './annonce.model';
import { ProgrammeEdition } from './programme-edition.model';
import { Pigeon } from './pigeon.model';
import { AgendaEvent } from './agenda-event.model';

export interface User {
  id?: number;
  email: string;
  password?: string;
  photoUrl?: string;
  ville: string;
  adresse?: string;
  telephone: string;
  description?: string;
  enabled: boolean;
  role?: AppRole;
  nomComplet?: string | null; 
  niveauExperience?: NiveauExperience | null; 
  dateNaissance?: string | Date | null;
  pigeons?: Pigeon[];
  agendaEvents?: AgendaEvent[];
  nomAssociation?: string | null; 
  responsable?: string | null; 
  dateCreation?: string | Date | null;
  statusInscription?: StatusInscription | null; 
  preuveLegalePath?: string | null; 
  annonces?: Annonce[];
  programmeEditions?: ProgrammeEdition[];
}