package com.it.molou3_backend.models.dtos.Pigeon;

import com.it.molou3_backend.models.enums.Sexe;
import com.it.molou3_backend.models.enums.StatusPigeon;
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
public class UpdatePigeonDTO {

    private String serieBague;

    @Enumerated(EnumType.STRING)
    private Sexe sexe;

    private LocalDate dateNaissance;

    private String photoUrl;

    @Enumerated(EnumType.STRING)
    private StatusPigeon statusPigeon ;
}
