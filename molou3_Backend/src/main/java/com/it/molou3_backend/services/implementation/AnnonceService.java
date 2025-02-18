package com.it.molou3_backend.services.implementation;

import com.it.molou3_backend.models.dtos.Annonce.CreateAnnonceDTO;
import com.it.molou3_backend.models.dtos.Annonce.ResponseAnnonceDTO;
import com.it.molou3_backend.models.dtos.Annonce.UpdateAnnonceDTO;
import com.it.molou3_backend.models.entities.Annonce;
import com.it.molou3_backend.models.mappers.AnnonceMapper;
import com.it.molou3_backend.repository.AnnonceRepository;
import com.it.molou3_backend.services.interfaces.IAnnonceService;
import org.springframework.stereotype.Service;

@Service
public class AnnonceService extends GenericService<Annonce,CreateAnnonceDTO,UpdateAnnonceDTO,ResponseAnnonceDTO> implements IAnnonceService {

    public AnnonceService(AnnonceRepository annonceRepository, AnnonceMapper annonceMapper) {
        super(annonceRepository, annonceMapper);
    }

}
