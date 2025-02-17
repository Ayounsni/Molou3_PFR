package com.it.molou3_backend.models.mappers.helpers;

import com.it.molou3_backend.models.entities.Plate;
import com.it.molou3_backend.repository.PlateRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class PlateMapperHelper {

    @Autowired
    private PlateRepository plateRepository;

    public Plate mapPlateIdToPlate(Long plateId) {
        return plateRepository.findById(plateId).orElse(null);
    }
}
