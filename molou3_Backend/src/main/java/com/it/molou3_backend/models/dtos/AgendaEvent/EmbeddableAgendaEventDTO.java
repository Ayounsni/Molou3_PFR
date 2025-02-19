package com.it.molou3_backend.models.dtos.AgendaEvent;

import com.it.molou3_backend.models.dtos.Colombophile.EmbeddableColombophileDTO;
import com.it.molou3_backend.models.enums.TypeEvent;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EmbeddableAgendaEventDTO {

    private Long id;

    private String description;

    private LocalDate dateDebut;

    private LocalDate dateFin;

    private TypeEvent typeEvent;

}
