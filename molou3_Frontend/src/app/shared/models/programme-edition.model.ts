import { Association } from './association.model';
import { EtapeCompetition } from './etape-competition.model';

export interface ProgrammeEdition {
  id?: number;
  annee: number;
  description?: string;
  association?: Association;
  etapeCompetitions?: EtapeCompetition[];
}