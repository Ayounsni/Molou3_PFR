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
public class CreateColombophileDTO {

    @NotBlank
    @Email
    private String email;

    @NotBlank
    @Size(min = 8, message = "Le mot de passe doit contenir au moins 8 caractères")
    private String password;

    @NotNull
    private Long roleId;

    private String photoUrl;

    @NotBlank
    private String ville ;

    private String adresse;

    @NotBlank
    @Pattern(regexp = "^(\\+212|0)[5-7][0-9]{8}$", message = "Numéro de téléphone invalide")
    private String telephone;

    private String description;

    @NotBlank
    @Pattern(regexp = "^[A-Za-zÀ-ÖØ-öø-ÿ\\s-]+$", message = "Le nom complet ne doit contenir que des lettres et espaces")
    private String nomComplet;

    @Enumerated(EnumType.STRING)
    private NiveauExperience niveauExperience;

    @NotNull
    @Past(message = "La date de naissance doit être dans le passé")
    private LocalDate dateNaissance;
}
