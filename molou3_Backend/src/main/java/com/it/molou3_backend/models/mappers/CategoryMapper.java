package com.it.molou3_backend.models.mappers;

import com.it.molou3_backend.models.dtos.Category.CreateCategoryDTO;
import com.it.molou3_backend.models.dtos.Category.ResponseCategoryDTO;
import com.it.molou3_backend.models.dtos.Category.UpdateCategoryDTO;
import com.it.molou3_backend.models.entities.Category;
import org.mapstruct.Mapper;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface CategoryMapper extends GenericMapper<Category, CreateCategoryDTO, UpdateCategoryDTO,ResponseCategoryDTO> {

}
