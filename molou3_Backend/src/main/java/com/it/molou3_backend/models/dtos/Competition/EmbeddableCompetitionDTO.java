package com.it.molou3_backend.models.dtos.Competition;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EmbeddableCompetitionDTO {
    private String ville;

    private Double distance;

    private LocalDate competitionDate;

    private LocalDate reunionDate;  // Date du rassemblement des pigeons

    private LocalTime reunionHoraire;  // Heure du rassemblement des pigeons

    private String pdfClassement;
}
