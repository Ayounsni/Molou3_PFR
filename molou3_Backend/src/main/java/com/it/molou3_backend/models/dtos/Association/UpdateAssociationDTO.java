package com.it.molou3_backend.models.dtos.Association;

import com.it.molou3_backend.models.enums.StatusInscription;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateAssociationDTO {

    @NotBlank
    @Email
    private String email;

    @NotBlank
    private String password;

    @NotNull
    private Long roleId;

    @NotBlank
    private String nomAssociation;

    @NotBlank
    private String responsable;

    @NotNull
    private LocalDate dateCreation;

    @Enumerated(EnumType.STRING)
    private StatusInscription statusInscription = StatusInscription.PENDING;

    @NotBlank
    private String preuveLegalePath;
}
