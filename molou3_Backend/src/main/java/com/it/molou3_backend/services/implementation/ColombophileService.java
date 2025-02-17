package com.it.molou3_backend.services.implementation;

import com.it.molou3_backend.models.dtos.Colombophile.CreateColombophileDTO;
import com.it.molou3_backend.models.dtos.Colombophile.ResponseColombophileDTO;
import com.it.molou3_backend.models.dtos.Colombophile.UpdateColombophileDTO;
import com.it.molou3_backend.models.entities.Colombophile;
import com.it.molou3_backend.models.mappers.ColombophileMapper;
import com.it.molou3_backend.repository.ColombophileRepository;
import com.it.molou3_backend.services.interfaces.IColombophileService;
import org.springframework.stereotype.Service;

@Service
public class ColombophileService extends GenericService<Colombophile,CreateColombophileDTO,UpdateColombophileDTO,ResponseColombophileDTO> implements IColombophileService {

    public ColombophileService(ColombophileRepository categoryRepository, ColombophileMapper categoryMapper) {
        super(categoryRepository, categoryMapper);
    }

}
