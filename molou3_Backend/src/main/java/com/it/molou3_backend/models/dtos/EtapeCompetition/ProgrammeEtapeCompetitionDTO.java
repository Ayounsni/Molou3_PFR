package com.it.molou3_backend.models.dtos.EtapeCompetition;

import com.it.molou3_backend.models.dtos.Competition.EmbeddableCompetitionDTO;
import com.it.molou3_backend.models.dtos.Competition.EmbeddableCompetitionEditionDTO;
import com.it.molou3_backend.models.enums.TypeEtape;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProgrammeEtapeCompetitionDTO {

    private Long id;

    private TypeEtape typeEtape;

    private String pdfClassement;

    private List<EmbeddableCompetitionEditionDTO> competitions;
}
