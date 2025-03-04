import { AgendaEvent } from './agenda-event.model';
import { AppUser } from './app-user.model';
import { NiveauExperience } from './enums/enums';
import { Pigeon } from './pigeon.model';


export interface Colombophile extends AppUser {
  nomComplet: string;
  niveauExperience: NiveauExperience;
  dateNaissance?: string | Date;
  pigeons?: Pigeon[];
  agendaEvents?: AgendaEvent[];
}