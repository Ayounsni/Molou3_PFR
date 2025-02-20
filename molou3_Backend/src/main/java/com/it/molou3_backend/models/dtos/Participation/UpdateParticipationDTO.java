package com.it.molou3_backend.models.dtos.Participation;

import com.it.molou3_backend.models.enums.StatusParticipation;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Duration;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateParticipationDTO {
    private Integer classement;

    private Duration tempsVol;

    @Enumerated(EnumType.STRING)
    private StatusParticipation statusParticipation;
}
