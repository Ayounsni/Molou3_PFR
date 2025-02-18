package com.it.molou3_backend.models.dtos.Annonce;

import com.it.molou3_backend.models.entities.Association;
import com.it.molou3_backend.validation.annotations.Exists;
import jakarta.persistence.Column;
import jakarta.persistence.ManyToOne;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateAnnonceDTO {

    @NotBlank
    private String titre;

    @NotBlank
    private String contenu;

    private LocalDateTime datePublication = LocalDateTime.now();

    @NotNull
    @Exists(entity = Association.class, message = "Cette association n'existe pas.")
    private Long associationId;
}
