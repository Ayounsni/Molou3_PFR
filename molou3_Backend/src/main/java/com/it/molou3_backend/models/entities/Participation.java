package com.it.molou3_backend.models.entities;


import com.it.molou3_backend.models.embeddableId.ParticipationId;
import com.it.molou3_backend.models.enums.StatusParticipation;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import jakarta.persistence.*;

import java.time.Duration;
import java.time.LocalDate;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Participation {

    @EmbeddedId
    private ParticipationId id;

    @ManyToOne
    @MapsId("competitionId")
    private Competition competition;

    @ManyToOne
    @MapsId("pigeonId")
    private Pigeon pigeon;

    private Integer classement;

    private Duration tempsVol;

    @Enumerated(EnumType.STRING)
    private StatusParticipation statusParticipation;

    @NotNull
    private LocalDate dateParticipation;
}
