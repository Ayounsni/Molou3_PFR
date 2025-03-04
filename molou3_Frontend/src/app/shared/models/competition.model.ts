import { EtapeCompetition } from "./etape-competition.model";
import { Participation } from "./participation.model";

export interface Competition {
  id?: number;
  ville: string;
  distance: number;
  competitionDate: string | Date;
  reunionDate: string | Date;
  reunionHoraire?: string | Date;
  pdfClassement?: string;
  etapeCompetition?: EtapeCompetition;
  participations?: Participation[];
}