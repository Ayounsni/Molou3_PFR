package com.it.molou3_backend.models.dtos.ProgrammeEdition;

import com.it.molou3_backend.models.dtos.Association.EmbeddableAssociationDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ResponseProgrammeEditionDTO {

    private Long id;

    private Integer annee;

    private String description;

    private EmbeddableAssociationDTO association;
}
