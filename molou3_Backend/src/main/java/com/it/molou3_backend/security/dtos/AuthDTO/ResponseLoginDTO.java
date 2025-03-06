package com.it.molou3_backend.security.dtos.AuthDTO;

import com.it.molou3_backend.models.enums.NiveauExperience;
import com.it.molou3_backend.models.enums.StatusInscription;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ResponseLoginDTO {
    // Champs de base d'AppUser
    private Long id;
    private String email;
    private String role;
    private String token;
    private String ville;
    private String telephone;
    private String photoUrl;
    private String adresse;
    private String description;
    private boolean enabled;

    // Champs spécifiques à Colombophile
    private String nomComplet;
    private NiveauExperience niveauExperience;
    private LocalDate dateNaissance;

    // Champs spécifiques à Association
    private String nomAssociation;
    private String responsable;
    private LocalDate dateCreation;
    private StatusInscription statusInscription;
    private String preuveLegalePath;
}
