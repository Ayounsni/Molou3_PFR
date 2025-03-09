package com.it.molou3_backend.services.interfaces;

import com.it.molou3_backend.models.dtos.Competition.CreateCompetitionDTO;
import com.it.molou3_backend.models.dtos.Competition.ResponseCompetitionDTO;
import com.it.molou3_backend.models.dtos.Competition.UpdateCompetitionDTO;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface ICompetitionService extends IGenericService<CreateCompetitionDTO,UpdateCompetitionDTO,ResponseCompetitionDTO> {
    ResponseCompetitionDTO update(Long id, UpdateCompetitionDTO updateCompetitionDTO, MultipartFile pdfClassementFile) throws IOException;

}
