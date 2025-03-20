import { AppUser } from './app-user.model';
import { Sexe, StatusPigeon } from './enums/enums';
import { Marketplace } from './marketplace.model';
import { Participation } from './participation.model';
import { User } from './user.model';

export interface Pigeon {
  id?: number;
  serieBague: string;
  sexe: Sexe;
  nationalite: string;
  dateNaissance?: string | Date;
  photoUrl?: string;
  statusPigeon: StatusPigeon;
  estFavori: boolean;
  colombophile?: User;
  marketplace?: Marketplace;
  participations?: Participation[];
}