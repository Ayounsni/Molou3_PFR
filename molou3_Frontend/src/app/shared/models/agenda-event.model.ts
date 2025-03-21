import { TypeEvent } from "./enums/enums";
import { User } from "./user.model";


export interface AgendaEvent {
  id?: number;
  description: string;
  dateDebut: string | Date;
  dateFin: string | Date;
  typeEvent: TypeEvent;
  colombophile?: User;
}