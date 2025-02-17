package com.it.molou3_backend.services.implementation;

import com.it.molou3_backend.models.dtos.Category.CreateCategoryDTO;
import com.it.molou3_backend.models.dtos.Category.ResponseCategoryDTO;
import com.it.molou3_backend.models.dtos.Category.UpdateCategoryDTO;
import com.it.molou3_backend.models.entities.Category;
import com.it.molou3_backend.models.mappers.CategoryMapper;
import com.it.molou3_backend.repository.CategoryRepository;
import com.it.molou3_backend.services.interfaces.ICategoryService;
import org.springframework.stereotype.Service;

@Service
public class CategoryService extends GenericService<Category,CreateCategoryDTO,UpdateCategoryDTO,ResponseCategoryDTO> implements ICategoryService {

    public CategoryService(CategoryRepository categoryRepository, CategoryMapper categoryMapper) {
        super(categoryRepository, categoryMapper);
    }

}
