package com.it.molou3_backend.models.dtos.EtapeCompetition;

import com.it.molou3_backend.models.dtos.ProgrammeEdition.EmbeddableProgrammeEditionDTO;
import com.it.molou3_backend.models.enums.TypeEtape;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EmbeddableEtapeCompetitionDTO {

    private Long id;

    private TypeEtape typeEtape;

    private String pdfClassement;
}
