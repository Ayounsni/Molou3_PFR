package com.it.molou3_backend.models.embeddableId;

import lombok.*;
import jakarta.persistence.*;
import java.io.Serializable;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ParticipationId implements Serializable {
    private Long competitionId;
    private Long pigeonId;
}


