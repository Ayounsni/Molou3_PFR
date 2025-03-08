package com.it.molou3_backend.models.dtos.Association;

import com.it.molou3_backend.models.enums.StatusInscription;
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
public class CreateAssociationDTO {
    @NotBlank
    @Email
    private String email;

    @NotBlank
    @Size(min = 8, message = "Le mot de passe doit contenir au moins 8 caractères")
    private String password;

    @NotNull
    private Long roleId;

    @NotBlank
    private String ville ;

    @NotBlank
    private String adresse;

    @NotBlank
    @Pattern(regexp = "^(\\+212|0)[5-7][0-9]{8}$", message = "Numéro de téléphone invalide")
    private String telephone;

    @Size(max = 500, message = "La description ne doit pas dépasser 500 caractères")
    private String description;

    @NotBlank
    private String nomAssociation;

    @NotBlank(message = "Le nom du responsable est obligatoire")
    @Pattern(regexp = "^[A-Za-zÀ-ÖØ-öø-ÿ\\s-]+$", message = "Le nom complet ne doit contenir que des lettres et espaces")
    private String responsable;

    @NotNull
    @PastOrPresent(message = "La date de création ne peut pas être dans le futur")
    private LocalDate dateCreation;

    @Enumerated(EnumType.STRING)
    private StatusInscription statusInscription = StatusInscription.PENDING;


}
