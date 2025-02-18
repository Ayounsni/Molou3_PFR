package com.it.molou3_backend.models.mappers;

import com.it.molou3_backend.models.dtos.AgendaEvent.CreateAgendaEventDTO;
import com.it.molou3_backend.models.dtos.AgendaEvent.ResponseAgendaEventDTO;
import com.it.molou3_backend.models.dtos.AgendaEvent.UpdateAgendaEventDTO;
import com.it.molou3_backend.models.entities.AgendaEvent;
import com.it.molou3_backend.models.mappers.helpers.ColombophileMapperHelper;
import com.it.molou3_backend.security.mappers.helpers.AppRoleMapperHelper;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring",uses = {AppRoleMapperHelper.class, ColombophileMapperHelper.class}, nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface AgendaEventMapper extends GenericMapper<AgendaEvent, CreateAgendaEventDTO, UpdateAgendaEventDTO, ResponseAgendaEventDTO> {
    @Override
    @Mapping(target = "colombophile", source = "colombophileId")
    AgendaEvent toEntity(CreateAgendaEventDTO createDTO);

}
