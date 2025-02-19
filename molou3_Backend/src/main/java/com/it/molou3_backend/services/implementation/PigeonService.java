package com.it.molou3_backend.services.implementation;

import com.it.molou3_backend.models.dtos.Pigeon.CreatePigeonDTO;
import com.it.molou3_backend.models.dtos.Pigeon.ResponsePigeonDTO;
import com.it.molou3_backend.models.dtos.Pigeon.UpdatePigeonDTO;
import com.it.molou3_backend.models.entities.Pigeon;
import com.it.molou3_backend.models.mappers.PigeonMapper;
import com.it.molou3_backend.repository.PigeonRepository;
import com.it.molou3_backend.services.interfaces.IPigeonService;
import org.springframework.stereotype.Service;

@Service
public class PigeonService extends GenericService<Pigeon,CreatePigeonDTO,UpdatePigeonDTO,ResponsePigeonDTO> implements IPigeonService {

    public PigeonService(PigeonRepository pigeonRepository, PigeonMapper pigeonMapper) {
        super(pigeonRepository, pigeonMapper);
    }

}
