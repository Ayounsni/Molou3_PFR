package com.it.molou3_backend.controllers;

import com.it.molou3_backend.models.dtos.Category.CreateCategoryDTO;
import com.it.molou3_backend.models.dtos.Category.ResponseCategoryDTO;
import com.it.molou3_backend.models.dtos.Category.UpdateCategoryDTO;
import com.it.molou3_backend.models.dtos.Pagination.PageDTO;
import com.it.molou3_backend.models.entities.Category;
import com.it.molou3_backend.services.implementation.CategoryService;
import com.it.molou3_backend.validation.annotations.Exists;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Validated
@RestController
@RequestMapping("/api/public/category")
public class CategoryController {
    @Autowired
    private CategoryService categoryService;

    @PostMapping
    public ResponseEntity<ResponseCategoryDTO> createCategory(@Valid @RequestBody CreateCategoryDTO createCategoryDTO) {
        ResponseCategoryDTO category = categoryService.create(createCategoryDTO);
        return new ResponseEntity<>(category, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResponseCategoryDTO> getCategoryById(@Exists(entity = Category.class , message = "Cet category n'existe pas.")  @PathVariable("id") Long id) {
            ResponseCategoryDTO category = categoryService.findById(id);
            return new ResponseEntity<>(category, HttpStatus.OK);
    }
    @GetMapping
    public ResponseEntity<PageDTO<ResponseCategoryDTO>> getAllCategorysPaginated(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "3") int size
    ) {
        PageDTO<ResponseCategoryDTO> categorys = categoryService.findAll(page, size);
        return new ResponseEntity<>(categorys, HttpStatus.OK);
    }
    @GetMapping("/all")
    public ResponseEntity<List<ResponseCategoryDTO>> getAllCategorys() {
        List<ResponseCategoryDTO> categorys = categoryService.findAll();
        return new ResponseEntity<>(categorys, HttpStatus.OK);
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteCategory(@Exists(entity = Category.class , message = "Cet category n'existe pas.") @PathVariable("id") Long id) {
            categoryService.deleteById(id);
            return new ResponseEntity<>("Category est supprimé avec succès", HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ResponseCategoryDTO> updateCategory(@Exists(entity = Category.class , message = "Cet category n'existe pas.") @PathVariable("id") Long id, @Valid @RequestBody UpdateCategoryDTO updateCategoryDTO) {

            ResponseCategoryDTO updatedCategory = categoryService.update(id, updateCategoryDTO);
            return new ResponseEntity<>(updatedCategory, HttpStatus.OK);
    }


}
