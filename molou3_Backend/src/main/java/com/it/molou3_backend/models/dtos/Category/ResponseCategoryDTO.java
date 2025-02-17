package com.it.molou3_backend.models.dtos.Category;

import com.it.molou3_backend.models.dtos.Plate.EmbeddablePlateDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ResponseCategoryDTO {
    private Long id;
    private String name;
    private List<EmbeddablePlateDTO> plates; // Pour retourner les noms des plats associés à la catégorie
}
