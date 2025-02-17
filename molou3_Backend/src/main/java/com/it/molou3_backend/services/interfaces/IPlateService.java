package com.it.molou3_backend.services.interfaces;

import com.it.molou3_backend.models.dtos.Plate.CreatePlateDTO;
import com.it.molou3_backend.models.dtos.Plate.ResponsePlateDTO;
import com.it.molou3_backend.models.dtos.Plate.UpdatePlateDTO;

public interface IPlateService extends IGenericService<CreatePlateDTO,UpdatePlateDTO,ResponsePlateDTO> {

}
