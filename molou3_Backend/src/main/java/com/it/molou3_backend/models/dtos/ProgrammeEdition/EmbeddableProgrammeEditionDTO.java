package com.it.molou3_backend.models.dtos.ProgrammeEdition;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EmbeddableProgrammeEditionDTO {
    private Long id;

    private Integer annee;

    private String description;
}
