import { Competition } from './competition.model';
import { TypeEtape } from './enums/enums';
import { ProgrammeEdition } from './programme-edition.model';

export interface EtapeCompetition {
  id?: number;
  typeEtape: TypeEtape;
  pdfClassement?: string;
  programmeEdition?: ProgrammeEdition;
  competitions?: Competition[];
}