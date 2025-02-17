package com.it.molou3_backend.models.dtos.Plate;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdatePlateDTO {

    private String name; // Nom du plat

    private String description; // Description du plat

    private int price; // Prix du plat

    private Boolean available; // Disponibilité du plat

    private Long categoryId; // ID de la catégorie associée
}
