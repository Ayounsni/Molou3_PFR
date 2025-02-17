package com.it.molou3_backend.models.dtos.Category;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EmbeddableCategoryDTO {
    private Long id;
    private String name;
}
