package com.it.molou3_backend.models.mappers;

import com.it.molou3_backend.models.dtos.ProgrammeEdition.CreateProgrammeEditionDTO;
import com.it.molou3_backend.models.dtos.ProgrammeEdition.ResponseProgrammeEditionDTO;
import com.it.molou3_backend.models.dtos.ProgrammeEdition.UpdateProgrammeEditionDTO;
import com.it.molou3_backend.models.entities.ProgrammeEdition;
import com.it.molou3_backend.models.mappers.helpers.AssociationMapperHelper;
import com.it.molou3_backend.security.mappers.helpers.AppRoleMapperHelper;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring",uses = {AppRoleMapperHelper.class, AssociationMapperHelper.class}, nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface ProgrammeEditionMapper extends GenericMapper<ProgrammeEdition, CreateProgrammeEditionDTO, UpdateProgrammeEditionDTO, ResponseProgrammeEditionDTO> {
    @Override
    @Mapping(target = "association", source = "associationId")
    ProgrammeEdition toEntity(CreateProgrammeEditionDTO createDTO);

}
