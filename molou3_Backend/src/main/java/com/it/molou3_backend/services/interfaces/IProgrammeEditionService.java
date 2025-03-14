package com.it.molou3_backend.services.interfaces;

import com.it.molou3_backend.models.dtos.Pagination.PageDTO;
import com.it.molou3_backend.models.dtos.ProgrammeEdition.CreateProgrammeEditionDTO;
import com.it.molou3_backend.models.dtos.ProgrammeEdition.ResponseProgrammeEditionDTO;
import com.it.molou3_backend.models.dtos.ProgrammeEdition.UpdateProgrammeEditionDTO;

public interface IProgrammeEditionService extends IGenericService<CreateProgrammeEditionDTO,UpdateProgrammeEditionDTO,ResponseProgrammeEditionDTO> {
    PageDTO<ResponseProgrammeEditionDTO> findByAssociationId(Long associationId, int page, int size);

}
