package com.it.molou3_backend.services.interfaces;

import com.it.molou3_backend.models.dtos.Participation.CreateParticipationDTO;
import com.it.molou3_backend.models.dtos.Participation.ResponseParticipationDTO;
import com.it.molou3_backend.models.dtos.Participation.UpdateParticipationDTO;

public interface IParticipationService {
    ResponseParticipationDTO create(CreateParticipationDTO createParticipationDTO);
    ResponseParticipationDTO update(Long pigeonId,Long competitionId, UpdateParticipationDTO updateDTO);

}
