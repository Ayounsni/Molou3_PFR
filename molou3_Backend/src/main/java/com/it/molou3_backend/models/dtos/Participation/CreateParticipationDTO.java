package com.it.molou3_backend.models.dtos.Participation;

import com.it.molou3_backend.models.embeddableId.ParticipationId;
import com.it.molou3_backend.models.entities.Competition;
import com.it.molou3_backend.models.entities.Pigeon;
import com.it.molou3_backend.models.enums.StatusParticipation;
import com.it.molou3_backend.validation.annotations.Exists;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapsId;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Duration;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateParticipationDTO {

    @NotNull
    @Exists(entity = Competition.class, message = "Cette competition n'existe pas.")
    private Long competitionId;

    @NotNull
    @Exists(entity = Pigeon.class, message = "Ce pigeon n'existe pas.")
    private Long pigeonId;

    private LocalDate dateParticipation = LocalDate.now();
}
