package com.it.molou3_backend.models.dtos.Annonce;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateAnnonceDTO {

    private String titre;

    private String contenu;

    private LocalDateTime datePublication = LocalDateTime.now();
}
