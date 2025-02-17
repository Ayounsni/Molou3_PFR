package com.it.molou3_backend.services.implementation;

import com.it.molou3_backend.models.dtos.Association.CreateAssociationDTO;
import com.it.molou3_backend.models.dtos.Association.ResponseAssociationDTO;
import com.it.molou3_backend.models.dtos.Association.UpdateAssociationDTO;
import com.it.molou3_backend.models.entities.Association;
import com.it.molou3_backend.models.mappers.AssociationMapper;
import com.it.molou3_backend.repository.AssociationRepository;
import com.it.molou3_backend.services.interfaces.IAssociationService;
import org.springframework.stereotype.Service;

@Service
public class AssociationService extends GenericService<Association,CreateAssociationDTO,UpdateAssociationDTO,ResponseAssociationDTO> implements IAssociationService {

    public AssociationService(AssociationRepository plateRepository, AssociationMapper plateMapper) {
        super(plateRepository, plateMapper);
    }

}
