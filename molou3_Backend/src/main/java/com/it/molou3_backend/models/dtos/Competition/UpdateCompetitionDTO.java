package com.it.molou3_backend.models.dtos.Competition;

import com.it.molou3_backend.models.entities.EtapeCompetition;
import com.it.molou3_backend.validation.annotations.Exists;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateCompetitionDTO {

    private String ville;

    private Double distance;

    private LocalDate competitionDate;

    private LocalDate reunionDate;  // Date du rassemblement des pigeons

    private LocalDateTime reunionHoraire;  // Heure du rassemblement des pigeons

    private String pdfClassement;

    @Exists(entity = EtapeCompetition.class, message = "Cette étape n'existe pas.")
    private Long etapeCompetitionId;
}
