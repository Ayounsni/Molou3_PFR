package com.it.molou3_backend.models.dtos.Colombophile;

import com.it.molou3_backend.models.enums.NiveauExperience;
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
public class UpdateColombophileDTO {
    @NotBlank
    @Email
    private String email;

    @NotBlank
    private String password;

    @NotNull
    private Long roleId;

    @NotBlank
    private String nomComplet;

    @Enumerated(EnumType.STRING)
    private NiveauExperience niveauExperience;

    private LocalDate dateNaissance;
}
