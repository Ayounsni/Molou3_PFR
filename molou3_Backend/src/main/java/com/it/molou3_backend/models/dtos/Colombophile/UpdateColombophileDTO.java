package com.it.molou3_backend.models.dtos.Colombophile;

import com.it.molou3_backend.models.enums.NiveauExperience;
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
public class UpdateColombophileDTO {

    @Email
    private String email;


    private Long roleId;


    private String ville ;

    private String adresse;

    @Pattern(regexp = "^(\\+212|0)[5-7][0-9]{8}$", message = "Numéro de téléphone invalide")
    private String telephone;

    private String description;

    private Boolean enabled;

    private String nomComplet;

    @Enumerated(EnumType.STRING)
    private NiveauExperience niveauExperience;

    @Past(message = "La date de naissance doit être dans le passé")
    private LocalDate dateNaissance;
}
