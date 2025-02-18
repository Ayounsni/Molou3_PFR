package com.it.molou3_backend.services.implementation;

import com.it.molou3_backend.models.dtos.EtapeCompetition.CreateEtapeCompetitionDTO;
import com.it.molou3_backend.models.dtos.EtapeCompetition.ResponseEtapeCompetitionDTO;
import com.it.molou3_backend.models.dtos.EtapeCompetition.UpdateEtapeCompetitionDTO;
import com.it.molou3_backend.models.dtos.EtapeCompetition.CreateEtapeCompetitionDTO;
import com.it.molou3_backend.models.dtos.EtapeCompetition.ResponseEtapeCompetitionDTO;
import com.it.molou3_backend.models.entities.EtapeCompetition;
import com.it.molou3_backend.models.entities.EtapeCompetition;
import com.it.molou3_backend.models.enums.TypeEtape;
import com.it.molou3_backend.models.mappers.EtapeCompetitionMapper;
import com.it.molou3_backend.models.mappers.EtapeCompetitionMapper;
import com.it.molou3_backend.repository.EtapeCompetitionRepository;
import com.it.molou3_backend.repository.EtapeCompetitionRepository;
import com.it.molou3_backend.services.interfaces.IEtapeCompetitionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EtapeCompetitionService extends GenericService<EtapeCompetition,CreateEtapeCompetitionDTO,UpdateEtapeCompetitionDTO,ResponseEtapeCompetitionDTO> implements IEtapeCompetitionService {

    public EtapeCompetitionService(EtapeCompetitionRepository etapeCompetitionRepository, EtapeCompetitionMapper etapeCompetitionMapper) {
        super(etapeCompetitionRepository, etapeCompetitionMapper);
    }

    @Autowired
    public EtapeCompetitionRepository etapeCompetitionRepository;
    @Autowired
    public EtapeCompetitionMapper etapeCompetitionMapper;



    @Override
    public ResponseEtapeCompetitionDTO create(CreateEtapeCompetitionDTO createEtapeCompetitionDTO) {

        boolean exists = etapeCompetitionRepository.existsByProgrammeEditionIdAndTypeEtape(
                createEtapeCompetitionDTO.getProgrammeEditionId(),
                createEtapeCompetitionDTO.getTypeEtape()
        );
        if (exists) {
            throw new IllegalArgumentException("Ce type d'étape existe déjà pour cette édition de programme.");
        }
        EtapeCompetition user = etapeCompetitionMapper.toEntity(createEtapeCompetitionDTO);
        return etapeCompetitionMapper.toDTO(etapeCompetitionRepository.save(user)) ;
    }

    @Override
    public ResponseEtapeCompetitionDTO update(Long id, UpdateEtapeCompetitionDTO updateEtapeCompetitionDTO) {

        EtapeCompetition entity = etapeCompetitionRepository.findById(id).orElseThrow(() ->
                new IllegalArgumentException("L'étape de compétition avec cet ID n'existe pas.")
        );
        Long currentProgrammeEditionId = entity.getProgrammeEdition().getId();
        TypeEtape currentTypeEtape = entity.getTypeEtape();

        Long newProgrammeEditionId = updateEtapeCompetitionDTO.getProgrammeEditionId() != null ?
                updateEtapeCompetitionDTO.getProgrammeEditionId() : currentProgrammeEditionId;

        TypeEtape newTypeEtape = updateEtapeCompetitionDTO.getTypeEtape() != null ?
                updateEtapeCompetitionDTO.getTypeEtape() : currentTypeEtape;

        boolean exists = etapeCompetitionRepository.existsByProgrammeEditionIdAndTypeEtape(newProgrammeEditionId, newTypeEtape);

        if (exists && (!newProgrammeEditionId.equals(currentProgrammeEditionId) || !newTypeEtape.equals(currentTypeEtape))) {
            throw new IllegalArgumentException("Ce type d'étape existe déjà pour cette édition de programme.");
        }

        EtapeCompetition updatedEntity = mapper.updateEntityFromDTO(updateEtapeCompetitionDTO, entity);
        updatedEntity = repository.save(updatedEntity);
        return mapper.toDTO(updatedEntity);
    }


}
