package com.it.molou3_backend.services.implementation;

import com.it.molou3_backend.models.dtos.Pagination.PageDTO;
import com.it.molou3_backend.models.dtos.Participation.CreateParticipationDTO;
import com.it.molou3_backend.models.dtos.Participation.ResponseParticipationDTO;
import com.it.molou3_backend.models.dtos.Participation.CreateParticipationDTO;
import com.it.molou3_backend.models.dtos.Participation.ResponseParticipationDTO;
import com.it.molou3_backend.models.dtos.Participation.UpdateParticipationDTO;
import com.it.molou3_backend.models.embeddableId.ParticipationId;
import com.it.molou3_backend.models.entities.Participation;
import com.it.molou3_backend.models.entities.Participation;
import com.it.molou3_backend.models.entities.Pigeon;
import com.it.molou3_backend.models.enums.StatusParticipation;
import com.it.molou3_backend.models.enums.StatusPigeon;
import com.it.molou3_backend.models.mappers.ParticipationMapper;
import com.it.molou3_backend.models.mappers.ParticipationMapper;
import com.it.molou3_backend.repository.ParticipationRepository;
import com.it.molou3_backend.repository.ParticipationRepository;
import com.it.molou3_backend.repository.PigeonRepository;
import com.it.molou3_backend.services.interfaces.IParticipationService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ParticipationService implements IParticipationService {



    public final ParticipationRepository participationRepository;
    public final ParticipationMapper participationMapper;
    public final PigeonRepository pigeonRepository;

    @Override
    public ResponseParticipationDTO create(CreateParticipationDTO createParticipationDTO) {
        ParticipationId id = new ParticipationId(
                createParticipationDTO.getCompetitionId(),
                createParticipationDTO.getPigeonId()
        );

        if (participationRepository.existsById(id)) {
            throw new RuntimeException("Cette participation existe déjà.");
        }

        Pigeon pigeon = pigeonRepository.findById(createParticipationDTO.getPigeonId())
                .orElseThrow(() -> new RuntimeException("Pigeon introuvable."));

        if (pigeon.getStatusPigeon() == StatusPigeon.VENDU || pigeon.getStatusPigeon() == StatusPigeon.A_VENDRE) {
            throw new RuntimeException("Impossible d'inscrire un pigeon vendu ou en vente à une compétition.");
        }

        if (pigeon.getStatusPigeon() == StatusPigeon.MALADE) {
            throw new RuntimeException("Ce pigeon est malade et ne peut pas participer à une compétition.");
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

        if (!participationRepository.existsById(id)) {
            throw new RuntimeException("Cette participation n'existe pas.");
        }

        Participation participation = participationRepository.findById(id).orElseThrow();
        Participation updatedEntity = participationMapper.updateEntityFromDTO(updateDTO, participation);
        if (updateDTO.getStatusParticipation() == StatusParticipation.PERDU) {
            updatedEntity.setClassement(null);
            updatedEntity.setTempsVol(null);
            Pigeon pigeon = pigeonRepository.findById(pigeonId)
                    .orElseThrow(() -> new RuntimeException("Pigeon introuvable."));
            pigeon.setStatusPigeon(StatusPigeon.PERDU);
            pigeonRepository.save(pigeon);
        }
        if (updateDTO.getStatusParticipation() == StatusParticipation.ENTRE) {
            Pigeon pigeon = pigeonRepository.findById(pigeonId)
                    .orElseThrow(() -> new RuntimeException("Pigeon introuvable."));
            if(pigeon.getStatusPigeon() == StatusPigeon.PERDU) {
                pigeon.setStatusPigeon(StatusPigeon.DISPONIBLE);
                pigeonRepository.save(pigeon);
            }
        }
        updatedEntity = participationRepository.save(updatedEntity);
        return participationMapper.toDTO(updatedEntity);
    }

    @Override
    public ResponseParticipationDTO findById(Long pigeonId,Long competitionId) {
        ParticipationId id = new ParticipationId(
                competitionId,
                pigeonId
        );
        if (!participationRepository.existsById(id)) {
            throw new RuntimeException("Cette participation n'existe pas.");
        }
        Participation entity = participationRepository.findById(id).orElseThrow();
        return participationMapper.toDTO(entity);
    }

    @Override
    public PageDTO<ResponseParticipationDTO> findAll(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Participation> pagedResult = participationRepository.findAll(pageable);

        List<ResponseParticipationDTO> content = pagedResult.getContent()
                .stream()
                .map(participationMapper::toDTO)
                .toList();

        return new PageDTO<>(
                content,
                pagedResult.getNumber(),
                pagedResult.getSize(),
                pagedResult.getTotalElements(),
                pagedResult.getTotalPages(),
                pagedResult.isLast()
        );
    }

    @Override
    public List<ResponseParticipationDTO> findAll() {
        List<Participation> pagedResult = participationRepository.findAll();

        return pagedResult
                .stream()
                .map(participationMapper::toDTO)
                .toList();

    }

    @Override
    public void deleteById(Long pigeonId,Long competitionId) {
        ParticipationId id = new ParticipationId(
                competitionId,
                pigeonId
        );
        if (!participationRepository.existsById(id)) {
            throw new RuntimeException("Cette participation n'existe pas.");
        }
        participationRepository.deleteById(id);
    }


}
