package com.it.molou3_backend.models.dtos.Association;

import com.it.molou3_backend.models.enums.StatusInscription;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateAssociationDTO {

    @Email
    private String email;

    private String password;

    private Long roleId;

    private String ville ;

    private String adresse;

    private String nomAssociation;

    private String responsable;

    private Boolean enabled;

    private LocalDate dateCreation;

    @Pattern(regexp = "^(\\+212|0)[5-7][0-9]{8}$", message = "Numéro de téléphone invalide")
    private String telephone;

    private String description;

    @Enumerated(EnumType.STRING)
    private StatusInscription statusInscription;


    private String preuveLegalePath;
}
