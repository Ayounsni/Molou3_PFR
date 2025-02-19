package com.it.molou3_backend.models.dtos.Pigeon;

import com.it.molou3_backend.models.entities.Colombophile;
import com.it.molou3_backend.models.enums.Sexe;
import com.it.molou3_backend.models.enums.StatusPigeon;
import com.it.molou3_backend.validation.annotations.Exists;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreatePigeonDTO {

    @NotBlank
    private String serieBague;

    @Enumerated(EnumType.STRING)
    @NotNull
    private Sexe sexe;

    @NotNull
    private LocalDate dateNaissance;

    private String photoUrl;

    @Enumerated(EnumType.STRING)
    private StatusPigeon statusPigeon = StatusPigeon.DISPONIBLE;

    @NotNull
    @Exists(entity = Colombophile.class, message = "Ce colombophile n'existe pas.")
    private Long colombophileId;
}
