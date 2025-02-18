package com.it.molou3_backend.models.mappers;


import com.it.molou3_backend.models.dtos.Competition.CreateCompetitionDTO;
import com.it.molou3_backend.models.dtos.Competition.ResponseCompetitionDTO;
import com.it.molou3_backend.models.dtos.Competition.UpdateCompetitionDTO;
import com.it.molou3_backend.models.entities.Competition;
import com.it.molou3_backend.models.mappers.helpers.EtapeCompetitionMapperHelper;
import com.it.molou3_backend.models.mappers.helpers.ProgrammeEditionMapperHelper;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring",uses = {EtapeCompetitionMapperHelper.class}, nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface CompetitionMapper extends GenericMapper<Competition, CreateCompetitionDTO, UpdateCompetitionDTO, ResponseCompetitionDTO> {
    @Override
    @Mapping(target = "etapeCompetition", source = "etapeCompetitionId")
    Competition toEntity(CreateCompetitionDTO createDTO);

    @Override
    @Mapping(target = "etapeCompetition", source = "etapeCompetitionId")
    Competition updateEntityFromDTO(UpdateCompetitionDTO updateCompetitionDTO, @MappingTarget Competition entity);
}
