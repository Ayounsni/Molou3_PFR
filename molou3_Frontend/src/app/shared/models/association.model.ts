import { Annonce } from './annonce.model';
import { AppUser } from './app-user.model';
import { StatusInscription } from './enums/enums';
import { ProgrammeEdition } from './programme-edition.model';


export interface Association extends AppUser {
  nomAssociation: string;
  responsable: string;
  dateCreation: string | Date;
  statusInscription: StatusInscription;
  preuveLegalePath: string;
  annonces?: Annonce[];
  programmeEditions?: ProgrammeEdition[];
}