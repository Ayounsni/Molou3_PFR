package com.it.molou3_backend.models.mappers;


import com.it.molou3_backend.models.dtos.Association.CreateAssociationDTO;
import com.it.molou3_backend.models.dtos.Association.ResponseAssociationDTO;
import com.it.molou3_backend.models.dtos.Association.UpdateAssociationDTO;
import com.it.molou3_backend.models.entities.Association;
import com.it.molou3_backend.security.mappers.helpers.AppRoleMapperHelper;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring",uses = {AppRoleMapperHelper.class}, nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface AssociationMapper extends GenericMapper<Association, CreateAssociationDTO, UpdateAssociationDTO, ResponseAssociationDTO> {
    @Override
    @Mapping(target = "role", source = "roleId")
    Association toEntity(CreateAssociationDTO createDTO);

    @Override
    @Mapping(target = "role", source = "roleId")
    Association updateEntityFromDTO(UpdateAssociationDTO updateAssociationDTO, @MappingTarget Association entity);
}
