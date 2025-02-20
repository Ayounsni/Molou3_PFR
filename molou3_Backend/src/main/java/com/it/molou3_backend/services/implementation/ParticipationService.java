package com.it.molou3_backend.services.implementation;

import com.it.molou3_backend.models.dtos.Participation.CreateParticipationDTO;
import com.it.molou3_backend.models.dtos.Participation.ResponseParticipationDTO;
import com.it.molou3_backend.models.dtos.Participation.CreateParticipationDTO;
import com.it.molou3_backend.models.dtos.Participation.ResponseParticipationDTO;
import com.it.molou3_backend.models.dtos.Participation.UpdateParticipationDTO;
import com.it.molou3_backend.models.embeddableId.ParticipationId;
import com.it.molou3_backend.models.entities.Participation;
import com.it.molou3_backend.models.entities.Participation;
import com.it.molou3_backend.models.mappers.ParticipationMapper;
import com.it.molou3_backend.models.mappers.ParticipationMapper;
import com.it.molou3_backend.repository.ParticipationRepository;
import com.it.molou3_backend.repository.ParticipationRepository;
import com.it.molou3_backend.services.interfaces.IParticipationService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ParticipationService implements IParticipationService {



    public final ParticipationRepository participationRepository;
    public final ParticipationMapper participationMapper;

    @Override
    public ResponseParticipationDTO create(CreateParticipationDTO createParticipationDTO) {
        ParticipationId id = new ParticipationId(
                createParticipationDTO.getCompetitionId(),
                createParticipationDTO.getPigeonId()
        );

        if (participationRepository.existsById(id)) {
            throw new RuntimeException("Cette participation existe déjà.");
        }

        Participation participation = participationMapper.toEntity(createParticipationDTO);
        participation.setId(id);

        Participation saved = participationRepository.save(participation);
        return participationMapper.toDTO(saved);
    }


    @Override
    public ResponseParticipationDTO update(Long pigeonId,Long competitionId, UpdateParticipationDTO updateDTO) {

        ParticipationId id = new ParticipationId(
                competitionId,
                pigeonId
        );

        Participation participation = participationRepository.findById(id).orElseThrow();
        Participation updatedEntity = participationMapper.updateEntityFromDTO(updateDTO, participation);
        updatedEntity = participationRepository.save(updatedEntity);
        return participationMapper.toDTO(updatedEntity);
    }

}
