package com.it.molou3_backend.services.implementation;

import com.it.molou3_backend.models.dtos.Plate.CreatePlateDTO;
import com.it.molou3_backend.models.dtos.Plate.ResponsePlateDTO;
import com.it.molou3_backend.models.dtos.Plate.UpdatePlateDTO;
import com.it.molou3_backend.models.entities.Plate;
import com.it.molou3_backend.models.mappers.PlateMapper;
import com.it.molou3_backend.repository.PlateRepository;
import com.it.molou3_backend.services.interfaces.IPlateService;
import org.springframework.stereotype.Service;

@Service
public class PlateService extends GenericService<Plate,CreatePlateDTO,UpdatePlateDTO,ResponsePlateDTO> implements IPlateService {

    public PlateService(PlateRepository plateRepository, PlateMapper plateMapper) {
        super(plateRepository, plateMapper);
    }

}
