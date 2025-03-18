package com.it.molou3_backend.services.interfaces;

import com.it.molou3_backend.models.dtos.Association.CreateAssociationDTO;
import com.it.molou3_backend.models.dtos.Association.ResponseAssociationDTO;
import com.it.molou3_backend.models.dtos.Association.UpdateAssociationDTO;
import com.it.molou3_backend.models.dtos.Search.SearchAssociationDTO;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface IAssociationService extends IGenericService<CreateAssociationDTO,UpdateAssociationDTO,ResponseAssociationDTO> {
    ResponseAssociationDTO create(CreateAssociationDTO createAssociationDTO, MultipartFile preuveLegaleFile, MultipartFile logoFile) throws IOException;
    ResponseAssociationDTO update(Long id, UpdateAssociationDTO updateDTO, MultipartFile preuveLegaleFile, MultipartFile logoFile) throws IOException;
    List<ResponseAssociationDTO> searchAssociation(SearchAssociationDTO searchAssociationDTO);

}
