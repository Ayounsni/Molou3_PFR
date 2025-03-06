import { AppUser } from './app-user.model';
import { EtapeCompetition } from './etape-competition.model';
import { User } from './user.model';

export interface ProgrammeEdition {
  id?: number;
  annee: number;
  description?: string;
  association?: User;
  etapeCompetitions?: EtapeCompetition[];
}