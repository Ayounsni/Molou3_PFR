package com.it.molou3_backend.models.dtos.Competition;

import com.it.molou3_backend.models.entities.EtapeCompetition;
import com.it.molou3_backend.validation.annotations.Exists;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.FutureOrPresent;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateCompetitionDTO {

    private String ville;

    private Double distance;
    @Future(message = "La date de compétition doit être dans le futur.")
    private LocalDate competitionDate;

    @FutureOrPresent(message = "La date de réunion ne peut pas être dans le passé.")
    private LocalDate reunionDate;  // Date du rassemblement des pigeons

    private LocalTime reunionHoraire;  // Heure du rassemblement des pigeons

    private String pdfClassement;

    @Exists(entity = EtapeCompetition.class, message = "Cette étape n'existe pas.")
    private Long etapeCompetitionId;
}
