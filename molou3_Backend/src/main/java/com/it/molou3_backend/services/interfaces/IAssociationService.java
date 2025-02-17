package com.it.molou3_backend.services.interfaces;

import com.it.molou3_backend.models.dtos.Association.CreateAssociationDTO;
import com.it.molou3_backend.models.dtos.Association.ResponseAssociationDTO;
import com.it.molou3_backend.models.dtos.Association.UpdateAssociationDTO;

public interface IAssociationService extends IGenericService<CreateAssociationDTO,UpdateAssociationDTO,ResponseAssociationDTO> {

}
