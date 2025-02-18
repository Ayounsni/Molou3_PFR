package com.it.molou3_backend.models.mappers.helpers;

import com.it.molou3_backend.models.entities.ProgrammeEdition;
import com.it.molou3_backend.repository.ProgrammeEditionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class ProgrammeEditionMapperHelper {

    @Autowired
    private ProgrammeEditionRepository programmeEditionRepository;

    public ProgrammeEdition mapProgrammeEditionIdToProgrammeEdition(Long programmeEditionId) {
        return programmeEditionRepository.findById(programmeEditionId).orElse(null);
    }
}
