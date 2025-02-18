package com.it.molou3_backend.services.implementation;

import com.it.molou3_backend.models.dtos.ProgrammeEdition.CreateProgrammeEditionDTO;
import com.it.molou3_backend.models.dtos.ProgrammeEdition.ResponseProgrammeEditionDTO;
import com.it.molou3_backend.models.dtos.ProgrammeEdition.CreateProgrammeEditionDTO;
import com.it.molou3_backend.models.dtos.ProgrammeEdition.ResponseProgrammeEditionDTO;
import com.it.molou3_backend.models.dtos.ProgrammeEdition.UpdateProgrammeEditionDTO;
import com.it.molou3_backend.models.entities.ProgrammeEdition;
import com.it.molou3_backend.models.entities.ProgrammeEdition;
import com.it.molou3_backend.models.mappers.ProgrammeEditionMapper;
import com.it.molou3_backend.models.mappers.ProgrammeEditionMapper;
import com.it.molou3_backend.repository.ProgrammeEditionRepository;
import com.it.molou3_backend.repository.ProgrammeEditionRepository;
import com.it.molou3_backend.security.services.implementations.HaveIBeenPwnedService;
import com.it.molou3_backend.services.interfaces.IProgrammeEditionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProgrammeEditionService extends GenericService<ProgrammeEdition,CreateProgrammeEditionDTO,UpdateProgrammeEditionDTO,ResponseProgrammeEditionDTO> implements IProgrammeEditionService {

    public ProgrammeEditionService(ProgrammeEditionRepository programmeEditionRepository, ProgrammeEditionMapper programmeEditionMapper) {
        super(programmeEditionRepository, programmeEditionMapper);
    }

    @Autowired
    public ProgrammeEditionRepository programmeEditionRepository;
    @Autowired
    public ProgrammeEditionMapper programmeEditionMapper;



    @Override
    public ResponseProgrammeEditionDTO create(CreateProgrammeEditionDTO createProgrammeEditionDTO) {
        List<Integer> anneesExistantes = programmeEditionRepository
                .findAllByAssociationId(createProgrammeEditionDTO.getAssociationId())
                .stream()
                .map(ProgrammeEdition::getAnnee)
                .toList();

        if (anneesExistantes.contains(createProgrammeEditionDTO.getAnnee())) {
            throw new IllegalArgumentException("Un programme pour l'année " + createProgrammeEditionDTO.getAnnee()
                    + " existe déjà pour cette association.");
        }

        ProgrammeEdition user = programmeEditionMapper.toEntity(createProgrammeEditionDTO);
        return programmeEditionMapper.toDTO(programmeEditionRepository.save(user)) ;
    }



}
