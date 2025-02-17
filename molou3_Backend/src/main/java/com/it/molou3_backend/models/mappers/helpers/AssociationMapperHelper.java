package com.it.molou3_backend.models.mappers.helpers;

import com.it.molou3_backend.models.entities.Association;
import com.it.molou3_backend.repository.AssociationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class AssociationMapperHelper {

    @Autowired
    private AssociationRepository associationRepository;

    public Association mapAssociationIdToAssociation(Long associationId) {
        return associationRepository.findById(associationId).orElse(null);
    }
}
