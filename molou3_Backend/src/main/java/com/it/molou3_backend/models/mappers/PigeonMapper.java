package com.it.molou3_backend.models.mappers;

import com.it.molou3_backend.models.dtos.Pigeon.CreatePigeonDTO;
import com.it.molou3_backend.models.dtos.Pigeon.ResponsePigeonDTO;
import com.it.molou3_backend.models.dtos.Pigeon.UpdatePigeonDTO;
import com.it.molou3_backend.models.entities.Pigeon;
import com.it.molou3_backend.models.mappers.helpers.ColombophileMapperHelper;
import com.it.molou3_backend.security.mappers.helpers.AppRoleMapperHelper;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring",uses = {AppRoleMapperHelper.class, ColombophileMapperHelper.class}, nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface PigeonMapper extends GenericMapper<Pigeon, CreatePigeonDTO, UpdatePigeonDTO, ResponsePigeonDTO> {
    @Override
    @Mapping(target = "colombophile", source = "colombophileId")
    Pigeon toEntity(CreatePigeonDTO createDTO);

}
