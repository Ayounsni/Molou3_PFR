package com.it.molou3_backend.models.dtos.Competition;

import com.it.molou3_backend.models.entities.EtapeCompetition;
import com.it.molou3_backend.validation.annotations.Exists;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.validator.constraints.Length;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateCompetitionDTO {

    @NotNull
    @Length(min = 2, max = 50, message = "La ville doit contenir entre 2 et 50 caractères.")
    private String ville;

    @NotNull
    @Positive(message = "La distance doit être un nombre positif.")
    private Double distance;

    @NotNull
    @Future(message = "La date de compétition doit être dans le futur.")
    private LocalDate competitionDate;

    @NotNull
    @FutureOrPresent(message = "La date de réunion ne peut pas être dans le passé.")
    private LocalDate reunionDate;  // Date du rassemblement des pigeons

    private LocalDateTime reunionHoraire;  // Heure du rassemblement des pigeons

    private String pdfClassement;

    @NotNull
    @Exists(entity = EtapeCompetition.class, message = "Cette étape n'existe pas.")
    private Long etapeCompetitionId;
}
