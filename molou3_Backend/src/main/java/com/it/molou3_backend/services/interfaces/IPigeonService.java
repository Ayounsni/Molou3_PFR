package com.it.molou3_backend.services.interfaces;

import com.it.molou3_backend.models.dtos.Pigeon.CreatePigeonDTO;
import com.it.molou3_backend.models.dtos.Pigeon.ResponsePigeonDTO;
import com.it.molou3_backend.models.dtos.Pigeon.UpdatePigeonDTO;

public interface IPigeonService extends IGenericService<CreatePigeonDTO,UpdatePigeonDTO,ResponsePigeonDTO> {

}
