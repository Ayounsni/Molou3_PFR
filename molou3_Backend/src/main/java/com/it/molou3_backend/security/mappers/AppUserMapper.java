package com.it.molou3_backend.security.mappers;


import com.it.molou3_backend.security.dtos.AppUserDTO.CreateAppUserDTO;
import com.it.molou3_backend.security.dtos.AppUserDTO.ResponseAppUserDTO;
import com.it.molou3_backend.security.dtos.AppUserDTO.UpdateAppUserDTO;
import com.it.molou3_backend.security.entities.AppUser;
import com.it.molou3_backend.security.mappers.helpers.AppRoleMapperHelper;
import org.mapstruct.*;

@Mapper(componentModel = "spring",uses = {AppRoleMapperHelper.class}, nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface AppUserMapper {

    @Mapping(target = "role", source = "roleId")
    AppUser toEntity(CreateAppUserDTO createDTO);

    @Mapping(target = "role", source = "roleId")
    AppUser updateEntityFromDTO(UpdateAppUserDTO updateAppUserDTO, @MappingTarget AppUser entity);

    ResponseAppUserDTO toDTO(AppUser entity);
}
