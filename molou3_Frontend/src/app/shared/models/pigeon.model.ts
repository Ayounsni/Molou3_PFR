import { Colombophile } from './colombophile.model';
import { Sexe, StatusPigeon } from './enums/enums';
import { Marketplace } from './marketplace.model';
import { Participation } from './participation.model';

export interface Pigeon {
  id?: number;
  serieBague: string;
  sexe: Sexe;
  dateNaissance?: string | Date;
  photoUrl?: string;
  statusPigeon: StatusPigeon;
  estFavori: boolean;
  colombophile?: Colombophile;
  marketplace?: Marketplace;
  participations?: Participation[];
}