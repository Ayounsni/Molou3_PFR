package com.it.molou3_backend.models.mappers;


import com.it.molou3_backend.models.dtos.Marketplace.CreateMarketplaceDTO;
import com.it.molou3_backend.models.dtos.Marketplace.ResponseMarketplaceDTO;
import com.it.molou3_backend.models.dtos.Marketplace.UpdateMarketplaceDTO;
import com.it.molou3_backend.models.entities.Marketplace;
import com.it.molou3_backend.models.mappers.helpers.PigeonMapperHelper;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring",uses = {PigeonMapperHelper.class}, nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface MarketplaceMapper extends GenericMapper<Marketplace, CreateMarketplaceDTO, UpdateMarketplaceDTO, ResponseMarketplaceDTO> {
    @Override
    @Mapping(target = "pigeon", source = "pigeonId")
    Marketplace toEntity(CreateMarketplaceDTO createDTO);

    @Override
    @Mapping(target = "pigeon", source = "pigeonId")
    Marketplace updateEntityFromDTO(UpdateMarketplaceDTO updateMarketplaceDTO, @MappingTarget Marketplace entity);
}
