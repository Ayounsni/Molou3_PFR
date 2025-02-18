package com.it.molou3_backend.models.mappers;


import com.it.molou3_backend.models.dtos.EtapeCompetition.CreateEtapeCompetitionDTO;
import com.it.molou3_backend.models.dtos.EtapeCompetition.ResponseEtapeCompetitionDTO;
import com.it.molou3_backend.models.dtos.EtapeCompetition.UpdateEtapeCompetitionDTO;
import com.it.molou3_backend.models.entities.EtapeCompetition;
import com.it.molou3_backend.models.entities.ProgrammeEdition;
import com.it.molou3_backend.models.mappers.helpers.ProgrammeEditionMapperHelper;
import com.it.molou3_backend.security.mappers.helpers.AppRoleMapperHelper;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring",uses = {ProgrammeEditionMapperHelper.class}, nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface EtapeCompetitionMapper extends GenericMapper<EtapeCompetition, CreateEtapeCompetitionDTO, UpdateEtapeCompetitionDTO, ResponseEtapeCompetitionDTO> {
    @Override
    @Mapping(target = "programmeEdition", source = "programmeEditionId")
    EtapeCompetition toEntity(CreateEtapeCompetitionDTO createDTO);

    @Override
    @Mapping(target = "programmeEdition", source = "programmeEditionId")
    EtapeCompetition updateEntityFromDTO(UpdateEtapeCompetitionDTO updateEtapeCompetitionDTO, @MappingTarget EtapeCompetition entity);
}
