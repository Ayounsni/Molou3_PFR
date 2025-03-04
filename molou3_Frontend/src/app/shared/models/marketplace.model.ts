import { StatusVente } from "./enums/enums";
import { Pigeon } from "./pigeon.model";


export interface Marketplace {
  id?: number;
  prix: number;
  statusVente: StatusVente;
  pigeon?: Pigeon;
}