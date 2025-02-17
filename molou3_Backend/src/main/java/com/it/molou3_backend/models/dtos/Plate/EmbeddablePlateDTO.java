package com.it.molou3_backend.models.dtos.Plate;

import com.it.molou3_backend.models.dtos.Category.EmbeddableCategoryDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EmbeddablePlateDTO {
    private Long id; // ID du plat
    private String name; // Nom du plat
    private String description; // Description du plat
    private int price; // Prix du plat
    private Boolean available; // Disponibilité du plat
}
