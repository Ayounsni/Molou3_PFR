package com.it.molou3_backend.models.dtos.Pigeon;

import com.it.molou3_backend.models.entities.Colombophile;
import com.it.molou3_backend.models.entities.Pigeon;
import com.it.molou3_backend.models.enums.Sexe;
import com.it.molou3_backend.models.enums.StatusPigeon;
import com.it.molou3_backend.validation.annotations.Exists;
import com.it.molou3_backend.validation.annotations.Unique;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreatePigeonDTO {

    @NotBlank
    @Pattern(regexp = "^[A-Za-z0-9-]+$", message = "La série de bague ne doit contenir que des lettres, chiffres et tirets.")
    @Unique(entity = Pigeon.class, field = "serieBague", message = "Cette série de bague est déjà utilisée.")
    private String serieBague;

    @Enumerated(EnumType.STRING)
    @NotNull
    private Sexe sexe;

    @NotNull
    @PastOrPresent(message = "La date de naissance ne peut pas être dans le futur.")
    private LocalDate dateNaissance;

    private String photoUrl;

    @Enumerated(EnumType.STRING)
    private StatusPigeon statusPigeon = StatusPigeon.DISPONIBLE;

    @NotNull
    @Exists(entity = Colombophile.class, message = "Ce colombophile n'existe pas.")
    private Long colombophileId;
}
