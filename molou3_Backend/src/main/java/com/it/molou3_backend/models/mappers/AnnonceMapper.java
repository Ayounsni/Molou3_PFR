package com.it.molou3_backend.models.mappers;

import com.it.molou3_backend.models.dtos.Annonce.CreateAnnonceDTO;
import com.it.molou3_backend.models.dtos.Annonce.ResponseAnnonceDTO;
import com.it.molou3_backend.models.dtos.Annonce.UpdateAnnonceDTO;
import com.it.molou3_backend.models.entities.Annonce;
import com.it.molou3_backend.models.mappers.helpers.AssociationMapperHelper;
import com.it.molou3_backend.security.mappers.helpers.AppRoleMapperHelper;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring",uses = {AppRoleMapperHelper.class, AssociationMapperHelper.class}, nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface AnnonceMapper extends GenericMapper<Annonce, CreateAnnonceDTO, UpdateAnnonceDTO, ResponseAnnonceDTO> {
    @Override
    @Mapping(target = "association", source = "associationId")
    Annonce toEntity(CreateAnnonceDTO createDTO);

}
