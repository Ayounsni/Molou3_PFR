package com.it.molou3_backend.models.mappers;

import com.it.molou3_backend.models.dtos.Plate.CreatePlateDTO;
import com.it.molou3_backend.models.dtos.Plate.ResponsePlateDTO;
import com.it.molou3_backend.models.dtos.Plate.UpdatePlateDTO;
import com.it.molou3_backend.models.dtos.Plate.CreatePlateDTO;
import com.it.molou3_backend.models.dtos.Plate.ResponsePlateDTO;
import com.it.molou3_backend.models.dtos.Plate.UpdatePlateDTO;
import com.it.molou3_backend.models.entities.Plate;
import com.it.molou3_backend.models.entities.Plate;
import com.it.molou3_backend.models.mappers.helpers.CategoryMapperHelper;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring",uses = {CategoryMapperHelper.class}, nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface PlateMapper extends GenericMapper<Plate, CreatePlateDTO, UpdatePlateDTO,ResponsePlateDTO> {
    @Override
    @Mapping(target = "category", source = "categoryId")
    Plate toEntity(CreatePlateDTO createPlateDTO);

    @Override
    @Mapping(target = "category", source = "categoryId")
    Plate updateEntityFromDTO(UpdatePlateDTO updateDTO, @MappingTarget Plate entity);

    @Override
    @Mapping(target = "category", source = "category")
    ResponsePlateDTO toDTO(Plate question);

}
