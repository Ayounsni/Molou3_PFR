package com.it.molou3_backend.models.dtos.Category;

import com.it.molou3_backend.models.entities.Category;
import com.it.molou3_backend.validation.annotations.Unique;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateCategoryDTO {

    @NotBlank
    @Unique(entity = Category.class, field = "name")
    private String name;
}
