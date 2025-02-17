package com.it.molou3_backend.models.mappers.helpers;

import com.it.molou3_backend.models.entities.Category;
import com.it.molou3_backend.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class CategoryMapperHelper {

    @Autowired
    private CategoryRepository categoryRepository;

    public Category mapCategoryIdToCategory(Long categoryId) {
        return categoryRepository.findById(categoryId).orElse(null);
    }
}
