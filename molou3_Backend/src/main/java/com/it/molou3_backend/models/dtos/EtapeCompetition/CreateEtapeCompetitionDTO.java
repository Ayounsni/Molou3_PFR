package com.it.molou3_backend.models.dtos.EtapeCompetition;

import com.it.molou3_backend.models.entities.Association;
import com.it.molou3_backend.models.entities.ProgrammeEdition;
import com.it.molou3_backend.models.enums.TypeEtape;
import com.it.molou3_backend.validation.annotations.Exists;
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
public class CreateEtapeCompetitionDTO {

    @Enumerated(EnumType.STRING)
    @NotNull
    private TypeEtape typeEtape;

    private String pdfClassement;

    @NotNull
    @Exists(entity = ProgrammeEdition.class, message = "Ce programme edition n'existe pas.")
    private Long programmeEditionId;
}
