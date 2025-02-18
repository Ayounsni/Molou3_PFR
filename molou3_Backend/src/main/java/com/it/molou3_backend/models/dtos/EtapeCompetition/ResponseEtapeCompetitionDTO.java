package com.it.molou3_backend.models.dtos.EtapeCompetition;

import com.it.molou3_backend.models.dtos.ProgrammeEdition.EmbeddableProgrammeEditionDTO;
import com.it.molou3_backend.models.entities.ProgrammeEdition;
import com.it.molou3_backend.models.enums.TypeEtape;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.ManyToOne;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ResponseEtapeCompetitionDTO {

    private Long id;

    private TypeEtape typeEtape;

    private String pdfClassement;

    private EmbeddableProgrammeEditionDTO programmeEdition;
}
