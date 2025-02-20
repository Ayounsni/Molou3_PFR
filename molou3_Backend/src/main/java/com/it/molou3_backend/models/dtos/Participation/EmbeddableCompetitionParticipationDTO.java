package com.it.molou3_backend.models.dtos.Participation;

import com.it.molou3_backend.models.dtos.Competition.EmbeddableCompetitionDTO;
import com.it.molou3_backend.models.dtos.Pigeon.EmbeddablePigeonDTO;
import com.it.molou3_backend.models.enums.StatusParticipation;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Duration;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EmbeddableCompetitionParticipationDTO {
    private EmbeddablePigeonDTO pigeon;

    private Integer classement;

    private Duration tempsVol;

    private StatusParticipation statusParticipation;

    private LocalDate dateParticipation;
}
