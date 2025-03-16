package com.it.molou3_backend.models.dtos.Competition;

import com.it.molou3_backend.models.dtos.EtapeCompetition.EmbeddableEtapeCompetitionDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EmbeddableCompetitionEditionDTO {

    private Long id;

    private String ville;

    private Double distance;

    private LocalDate competitionDate;

    private LocalDate reunionDate;  // Date du rassemblement des pigeons

    private LocalTime reunionHoraire;  // Heure du rassemblement des pigeons

    private EmbeddableEtapeCompetitionDTO etapeCompetition;

    private String pdfClassement;
}
