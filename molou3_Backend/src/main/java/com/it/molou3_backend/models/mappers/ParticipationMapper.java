package com.it.molou3_backend.models.mappers;

import com.it.molou3_backend.models.dtos.Participation.CreateParticipationDTO;
import com.it.molou3_backend.models.dtos.Participation.ResponseParticipationDTO;
import com.it.molou3_backend.models.dtos.Participation.UpdateParticipationDTO;
import com.it.molou3_backend.models.entities.Participation;
import com.it.molou3_backend.models.mappers.helpers.CompetitionMapperHelper;
import com.it.molou3_backend.models.mappers.helpers.PigeonMapperHelper;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring",uses = {PigeonMapperHelper.class, CompetitionMapperHelper.class}, nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface ParticipationMapper extends GenericMapper<Participation, CreateParticipationDTO, UpdateParticipationDTO, ResponseParticipationDTO> {
    @Override
    @Mapping(target = "competition", source = "competitionId")
    @Mapping(target = "pigeon", source = "pigeonId")
    Participation toEntity(CreateParticipationDTO createDTO);

}
