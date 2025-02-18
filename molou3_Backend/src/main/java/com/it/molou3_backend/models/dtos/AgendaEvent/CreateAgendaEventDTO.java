package com.it.molou3_backend.models.dtos.AgendaEvent;

import com.it.molou3_backend.models.entities.Association;
import com.it.molou3_backend.models.entities.Colombophile;
import com.it.molou3_backend.models.enums.TypeEvent;
import com.it.molou3_backend.validation.annotations.Exists;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateAgendaEventDTO {

    @NotBlank
    private String description;

    @NotNull
    @FutureOrPresent(message = "La date de début doit être aujourd'hui ou dans le futur.")
    private LocalDate dateDebut;

    @NotNull
    @Future(message = "La date de fin doit être dans le futur.")
    private LocalDate dateFin;

    @Enumerated(EnumType.STRING)
    @NotNull
    private TypeEvent typeEvent;

    @NotNull
    @Exists(entity = Colombophile.class, message = "Ce colombophile n'existe pas.")
    private Long colombophileId;

    @AssertTrue(message = "La date de fin doit être après la date de début.")
    public boolean isDateFinAfterDateDebut() {
        return dateDebut != null && dateFin != null && dateFin.isAfter(dateDebut);
    }
}
