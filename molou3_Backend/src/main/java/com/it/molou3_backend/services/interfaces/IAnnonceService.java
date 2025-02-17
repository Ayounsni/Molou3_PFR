package com.it.molou3_backend.services.interfaces;

import com.it.molou3_backend.models.dtos.Annonce.CreateAnnonceDTO;
import com.it.molou3_backend.models.dtos.Annonce.ResponseAnnonceDTO;
import com.it.molou3_backend.models.dtos.Annonce.UpdateAnnonceDTO;

public interface IAnnonceService extends IGenericService<CreateAnnonceDTO,UpdateAnnonceDTO,ResponseAnnonceDTO> {

}
