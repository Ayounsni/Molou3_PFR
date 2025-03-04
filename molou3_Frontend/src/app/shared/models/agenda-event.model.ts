import { Colombophile } from "./colombophile.model";
import { TypeEvent } from "./enums/enums";


export interface AgendaEvent {
  id?: number;
  description: string;
  dateDebut: string | Date;
  dateFin: string | Date;
  typeEvent: TypeEvent;
  colombophile?: Colombophile;
}