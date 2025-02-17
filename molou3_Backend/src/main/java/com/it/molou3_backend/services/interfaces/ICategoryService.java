package com.it.molou3_backend.services.interfaces;

import com.it.molou3_backend.models.dtos.Category.CreateCategoryDTO;
import com.it.molou3_backend.models.dtos.Category.ResponseCategoryDTO;
import com.it.molou3_backend.models.dtos.Category.UpdateCategoryDTO;

public interface ICategoryService extends IGenericService<CreateCategoryDTO,UpdateCategoryDTO,ResponseCategoryDTO> {

}
