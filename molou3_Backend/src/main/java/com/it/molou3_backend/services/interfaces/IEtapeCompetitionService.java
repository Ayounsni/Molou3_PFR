package com.it.molou3_backend.services.interfaces;

import com.it.molou3_backend.models.dtos.EtapeCompetition.CreateEtapeCompetitionDTO;
import com.it.molou3_backend.models.dtos.EtapeCompetition.ResponseEtapeCompetitionDTO;
import com.it.molou3_backend.models.dtos.EtapeCompetition.UpdateEtapeCompetitionDTO;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface IEtapeCompetitionService extends IGenericService<CreateEtapeCompetitionDTO,UpdateEtapeCompetitionDTO,ResponseEtapeCompetitionDTO> {
    ResponseEtapeCompetitionDTO update(Long id, UpdateEtapeCompetitionDTO updateEtapeCompetitionDTO, MultipartFile pdfClassementFile) throws IOException;
    void deleteClassement(Long id);

}
