package com.it.molou3_backend.models.dtos.Colombophile;

import com.it.molou3_backend.models.enums.NiveauExperience;
import com.it.molou3_backend.security.dtos.AppRoleDTO.EmbeddableAppRoleDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EmbeddableColombophileDTO {
    private String id;

    private String email;

    private EmbeddableAppRoleDTO role;

    private String photoUrl;

    private String ville ;

    private String adresse;

    private String telephone;

    private String description;

    private String nomComplet;

    private NiveauExperience niveauExperience;

    private LocalDate dateNaissance;
}
