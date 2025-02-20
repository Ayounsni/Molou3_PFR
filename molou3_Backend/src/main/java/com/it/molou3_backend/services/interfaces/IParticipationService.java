package com.it.molou3_backend.services.interfaces;

import com.it.molou3_backend.models.dtos.Pagination.PageDTO;
import com.it.molou3_backend.models.dtos.Participation.CreateParticipationDTO;
import com.it.molou3_backend.models.dtos.Participation.ResponseParticipationDTO;
import com.it.molou3_backend.models.dtos.Participation.UpdateParticipationDTO;

import java.util.List;

public interface IParticipationService {
    ResponseParticipationDTO create(CreateParticipationDTO createParticipationDTO);
    ResponseParticipationDTO update(Long pigeonId,Long competitionId, UpdateParticipationDTO updateDTO);
    PageDTO<ResponseParticipationDTO> findAll(int page, int size);
    List<ResponseParticipationDTO> findAll();
    ResponseParticipationDTO findById(Long pigeonId,Long competitionId);
    void deleteById(Long pigeonId,Long competitionId);

}
