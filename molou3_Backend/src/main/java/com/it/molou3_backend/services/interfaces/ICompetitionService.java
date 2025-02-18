package com.it.molou3_backend.services.interfaces;

import com.it.molou3_backend.models.dtos.Competition.CreateCompetitionDTO;
import com.it.molou3_backend.models.dtos.Competition.ResponseCompetitionDTO;
import com.it.molou3_backend.models.dtos.Competition.UpdateCompetitionDTO;

public interface ICompetitionService extends IGenericService<CreateCompetitionDTO,UpdateCompetitionDTO,ResponseCompetitionDTO> {

}
