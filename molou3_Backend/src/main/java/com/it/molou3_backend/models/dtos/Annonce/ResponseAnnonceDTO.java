package com.it.molou3_backend.models.dtos.Annonce;

import com.it.molou3_backend.models.dtos.Association.EmbeddableAssociationDTO;
import com.it.molou3_backend.models.entities.Association;
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
public class ResponseAnnonceDTO {

    private Long id;

    private String titre;

    private String contenu;

    private LocalDateTime datePublication;

    private EmbeddableAssociationDTO association;
}
