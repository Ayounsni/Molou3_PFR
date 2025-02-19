package com.it.molou3_backend.models.dtos.Pigeon;

import com.it.molou3_backend.models.enums.Sexe;
import com.it.molou3_backend.models.enums.StatusPigeon;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EmbeddablePigeonDTO {
    private Long id;

    private String serieBague;

    private Sexe sexe;

    private LocalDate dateNaissance;

    private String photoUrl;

    private StatusPigeon statusPigeon;

    private Boolean estFavori = false;
}
