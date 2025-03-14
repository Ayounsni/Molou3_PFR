package com.it.molou3_backend.services.implementation;

import com.it.molou3_backend.models.dtos.Pagination.PageDTO;
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
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
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

    @Override
    public ResponseProgrammeEditionDTO update(Long id, UpdateProgrammeEditionDTO updateDTO) {
        if (updateDTO == null) {
            throw new NullPointerException("The DTO cannot be null");
        }

        // Récupérer l'entité existante
        ProgrammeEdition existingEntity = programmeEditionRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("ProgrammeEdition avec l'ID " + id + " n'existe pas"));

        // Vérifier l'unicité de l'année pour cette association
        List<ProgrammeEdition> editionsForAssociation = programmeEditionRepository
                .findAllByAssociationId(existingEntity.getAssociation().getId());

        boolean anneeExists = editionsForAssociation.stream()
                .anyMatch(edition ->
                        edition.getAnnee().equals(updateDTO.getAnnee()) &&
                                !edition.getId().equals(id) // Exclure l'entité actuelle
                );

        if (anneeExists) {
            throw new IllegalArgumentException("Un programme pour l'année " + updateDTO.getAnnee()
                    + " existe déjà pour cette association.");
        }

        // Mettre à jour l'entité avec les nouvelles données
        ProgrammeEdition updatedEntity = mapper.updateEntityFromDTO(updateDTO, existingEntity);
        updatedEntity = programmeEditionRepository.save(updatedEntity);
        return mapper.toDTO(updatedEntity);
    }
    @Override
    public PageDTO<ResponseProgrammeEditionDTO> findByAssociationId(Long associationId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<ProgrammeEdition> editionsPage = programmeEditionRepository.findByAssociationId(associationId, pageable);
        List<ResponseProgrammeEditionDTO> dtos = editionsPage.getContent().stream()
                .map(mapper::toDTO) // Assurez-vous d'avoir une méthode pour convertir l'entité en DTO
                .collect(Collectors.toList());
        return new PageDTO<>(
                dtos,
                editionsPage.getNumber(),
                editionsPage.getSize(),
                editionsPage.getTotalElements(),
                editionsPage.getTotalPages(),
                editionsPage.isLast()
        );
    }



}
