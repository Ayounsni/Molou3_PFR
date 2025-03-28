import { Competition } from './competition.model';
import { StatusParticipation } from './enums/enums';
import { ParticipationId } from './participation-id.model';
import { Pigeon } from './pigeon.model';


export interface Participation {
  id?: ParticipationId;
  competition?: Competition;
  pigeon?: Pigeon;
  classement?: number;
  tempsVol?: string; 
  statusParticipation?: StatusParticipation;
  dateParticipation: string | Date;
}