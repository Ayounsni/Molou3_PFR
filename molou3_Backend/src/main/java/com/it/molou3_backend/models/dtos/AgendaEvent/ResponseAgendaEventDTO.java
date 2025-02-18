package com.it.molou3_backend.models.dtos.AgendaEvent;

import com.it.molou3_backend.models.dtos.Colombophile.EmbeddableColombophileDTO;
import com.it.molou3_backend.models.entities.Colombophile;
import com.it.molou3_backend.models.enums.TypeEvent;
import jakarta.persistence.Column;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.ManyToOne;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ResponseAgendaEventDTO {

    private Long id;

    private String description;

    private LocalDate dateDebut;

    private LocalDate dateFin;

    private TypeEvent typeEvent;

    private EmbeddableColombophileDTO colombophile;
}
