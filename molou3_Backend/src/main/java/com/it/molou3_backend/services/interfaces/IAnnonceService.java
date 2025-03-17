package com.it.molou3_backend.services.interfaces;

import com.it.molou3_backend.models.dtos.Annonce.CreateAnnonceDTO;
import com.it.molou3_backend.models.dtos.Annonce.ResponseAnnonceDTO;
import com.it.molou3_backend.models.dtos.Annonce.UpdateAnnonceDTO;
import com.it.molou3_backend.models.dtos.Pagination.PageDTO;

public interface IAnnonceService extends IGenericService<CreateAnnonceDTO,UpdateAnnonceDTO,ResponseAnnonceDTO> {
    PageDTO<ResponseAnnonceDTO> findByAssociationId(Long associationId, int page, int size);

}
