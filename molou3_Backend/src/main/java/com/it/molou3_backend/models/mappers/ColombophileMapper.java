package com.it.molou3_backend.models.mappers;


import com.it.molou3_backend.models.dtos.Colombophile.CreateColombophileDTO;
import com.it.molou3_backend.models.dtos.Colombophile.ResponseColombophileDTO;
import com.it.molou3_backend.models.dtos.Colombophile.UpdateColombophileDTO;
import com.it.molou3_backend.models.dtos.Colombophile.CreateColombophileDTO;
import com.it.molou3_backend.models.dtos.Colombophile.ResponseColombophileDTO;
import com.it.molou3_backend.models.dtos.Colombophile.UpdateColombophileDTO;
import com.it.molou3_backend.models.entities.Colombophile;
import com.it.molou3_backend.models.entities.Colombophile;
import com.it.molou3_backend.security.mappers.helpers.AppRoleMapperHelper;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring",uses = {AppRoleMapperHelper.class}, nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface ColombophileMapper extends GenericMapper<Colombophile, CreateColombophileDTO, UpdateColombophileDTO, ResponseColombophileDTO> {
    @Override
    @Mapping(target = "role", source = "roleId")
    Colombophile toEntity(CreateColombophileDTO createDTO);

    @Override
    @Mapping(target = "role", source = "roleId")
    Colombophile updateEntityFromDTO(UpdateColombophileDTO updateColombophileDTO, @MappingTarget Colombophile entity);
}
